/* eslint-disable import/no-extraneous-dependencies, sonarjs/cognitive-complexity, no-bitwise */
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const nested = require('postcss-nested');
const csso = require('csso');

// https://github.com/wbyoung/babel-plugin-transform-postcss/blob/7d0cc7f9df569e9df6c78ae55ec6f86bac362c40/src/plugin.js

module.exports = function (babel, options = {}) {
  const { types: t } = babel;
  const {
    debug = false,
    allowedModules = ['foliage', 'foliage-react'],
    allowedMethods = ['css', 'keyframes', 'createGlobalStyle'],
    prefix,
  } = options;

  const nameCreate = debug
    ? (sid, name) => [prefix, sid, name].filter(Boolean).join('-')
    : (sid) => [prefix, sid].filter(Boolean).join('-');

  const compiler = postcss([autoprefixer(), nested()]);

  const markerRegexp = new RegExp(interpolationMark('\\d+'), 'gm');
  const varMarkerRegexp = new RegExp(
    `var\\(\\s*${interpolationMark('\\d+')}`,
    'gm',
  );

  function compile(source, file = 'source.css') {
    const ast = postcss.parse(source);
    const derivedInterpolations = {};
    function addInterpolation(list, type) {
      list.forEach((name) => {
        if (!derivedInterpolations[name]) derivedInterpolations[name] = type;
      });
    }

    ast.walk((node) => {
      switch (node.type) {
        // Detect if interpolation found in selector
        case 'rule': {
          const found = node.selector.match(markerRegexp);
          if (found) addInterpolation(found, 'selector');
          break;
        }

        // Detect when interpolation is used inside css properties or values
        case 'decl': {
          // Interpolation found in property declaration
          // Maybe it is custom property declaration
          const foundProp = node.prop.match(markerRegexp);
          if (foundProp) addInterpolation(foundProp, 'custom-property'); // user wants to set custom property value

          // When interpolation is used inside var(), we need not to match it below
          // Here we need to remove entire interpolation from content to mark, that it is already processed
          let content = node.value;
          const foundVars = content.match(varMarkerRegexp);
          if (foundVars) {
            // Found var() with interpolation
            foundVars.forEach((cssVar) => {
              // We need to find actual interpolation name to mark it as var
              const name = cssVar.match(markerRegexp);
              if (name) addInterpolation(name, 'var');
              // Remove `var(interpolation` from processing content, to mark it as already processed
              content = content.replace(cssVar, '');
            });
          }

          // Search for another interpolations
          const foundValues = content.match(markerRegexp);
          if (foundValues) {
            // If interpolation is used for animation, we know that it is a keyframe block
            if (node.prop === 'animation') {
              addInterpolation(foundValues, 'keyframe');
            } else {
              // Another types of interpolation is not supported yet
              addInterpolation(foundValues, 'INVALID');
            }
          }

          break;
        }

        default: /* noop */
      }
    });

    const result = compiler.process(ast, { from: file });
    const compiled = result.css;
    return {
      css: csso.minify(compiled).css,
      interpolations: derivedInterpolations,
    };
  }

  return {
    name: 'ast-transform', // not required
    // pre() {
    //   this.requiredSpecifiers = new Set();
    // },
    // post({ path }, state) {
    //   // const importNode = path.find((node) => node.isImportDeclaration());
    //   path.traverse(
    //     {
    //       ImportDeclaration(path) {
    //         if (t.isStringLiteral(path.node.source)) {
    //           console.log(path.node.source.value);
    //         }
    //       },
    //     },
    //     state,
    //   );

    //   this.requiredSpecifiers = null;
    // },
    visitor: {
      //VariableDeclarator(path, state) {
      //  path.node.id.name = addImport(path, 'mor', 'mod');
      //  path.scope.rename('mor');
      //},

      TaggedTemplateExpression(path, state) {
        resolveAllowedMethod(
          t,
          path,
          ({ methodName, moduleName, module, namespace }) => {
            // Check that template tag imported from allowed module
            // And method supports for compilation
            if (
              allowedModules.includes(moduleName) &&
              allowedMethods.includes(methodName)
            ) {
              // Create stable unique id with readable name
              const derivedName = determineName(t, path);
              const sid = generateStableID(
                state.file.opts.root,
                state.filename,
                derivedName,
                path.node.loc.start.line,
                path.node.loc.start.column,
              );
              const fullName = nameCreate(sid, derivedName);

              let content = null;

              // Process only tagged literals without interpolations
              if (path.node.quasi.quasis.length === 1) {
                const source = path.node.quasi.quasis[0].value.raw;
                const wrapped = createContainer(source, methodName, fullName);
                const { css } = compile(wrapped);
                content = t.stringLiteral(css);
              } else {
                const { quasis, expressions } = path.node.quasi;
                const draftCssSource = [quasis[0].value.cooked];
                expressions.forEach((node, index) => {
                  draftCssSource.push(interpolationMark(index));
                  draftCssSource.push(quasis[index + 1].value.cooked);
                });
                const source = draftCssSource.join(' ');
                const wrapped = createContainer(source, methodName, fullName);
                const { css, interpolations: interpType } = compile(wrapped);

                let chunks = [css];
                const interpolations = [];

                expressions.forEach((node, index) => {
                  const marker = interpolationMark(index);
                  const result = [];
                  // iterate over each quasis
                  chunks.forEach((chunk) => {
                    // if quasis has interpolation, split it to few parts
                    if (chunk.includes(marker)) {
                      chunk.split(marker).forEach((part, index, list) => {
                        const last = index === list.length - 1;
                        result.push(part);

                        const interpolationType = interpType[marker];

                        // Add import of assert method
                        const importSpecifier =
                          wrapperMethod[interpolationType];

                        const wrappedNode = namespace
                          ? createNamespaceWrapper(
                              t,
                              namespace,
                              importSpecifier,
                              node,
                            )
                          : createWrapperForInterpolation(
                              t,
                              interpolationType,
                              addSpecifier(t, module, importSpecifier),
                              node,
                            );
                        // Add expression only after not last
                        if (!last) interpolations.push(wrappedNode);
                      });
                    } else {
                      result.push(chunk);
                    }
                  });
                  chunks = result;
                });

                content = t.templateLiteral(
                  chunks.map((item, index, list) =>
                    t.templateElement({ raw: item }, index === list.length - 1),
                  ),
                  interpolations,
                );
              }

              path.replaceWith(
                t.objectExpression([
                  t.objectProperty(t.identifier('content'), content),
                  t.objectProperty(
                    t.identifier(methodName),
                    t.stringLiteral(fullName),
                  ),
                ]),
              );
            }
          },
        );
      },
    },
  };
};

const interpolationMark = (index) => `foliageInterpolationIndex${index}`;

function addSpecifier(t, module, specifierName) {
  const has = module.node.specifiers.find(
    (specifier) => specifier.imported.name === specifierName,
  );
  if (has) return has.local.name;

  const program = module.find((path) => path.isProgram());

  module.node.specifiers.push(
    t.importSpecifier(t.identifier(specifierName), t.identifier(specifierName)),
  );

  let found;

  module.get('specifiers').forEach((s) => {
    if (s.node.imported.name === specifierName) {
      found = s;
    }
    program.scope.registerBinding('module', s);
  });

  program.scope.rename(specifierName);

  return found.node.local.name;
}

const wrapperMethod = {
  selector: 'assertSelector',
  var: 'assertVariable',
  'custom-property': 'assertVariable',
  keyframe: 'assertKeyframe',
  INVALID: 'assertInvalid',
};

function createNamespaceWrapper(t, source, specifier, node) {
  return t.callExpression(
    t.memberExpression(t.identifier(source), t.identifier(specifier)),
    [node],
  );
}

function createWrapperForInterpolation(t, type, specifier, node) {
  if (specifier) {
    return t.callExpression(t.identifier(specifier), [node]);
  }

  throw new TypeError(
    `Invalid interpolation type "${type}". Please, report an issue at https://github.com/effector/foliage/issues`,
  );
}

function createContainer(source, type, fullName) {
  if (type === 'css') {
    return `.${fullName}{${source}}`;
  }
  if (type === 'keyframes') {
    return `@keyframes ${fullName}{${source}}`;
  }
  if (type === 'createGlobalStyle') {
    return source;
  }
  throw new TypeError(
    `Unsupported node type "${type}" detected on "${fullName}" with source "${source}"`,
  );
}

/**
 *
 * @param {(p: { methodName: string, moduleName: string, module: Path, namespace: string | null }) => void} fn
 */
function resolveAllowedMethod(t, path, fn) {
  // Check that tag.object is a `* as import from 'foliage'`
  if (
    t.isMemberExpression(path.node.tag) &&
    t.isIdentifier(path.node.tag.object) &&
    t.isIdentifier(path.node.tag.property)
  ) {
    const objectName = path.node.tag.object.name;
    const methodName = path.node.tag.property.name;
    const binding = path.scope.getOwnBinding(objectName);
    if (binding) {
      const resolved = resolveNamespaceImport(t, binding);
      if (resolved) {
        const moduleName = resolved.module.node.source.value;
        fn({
          moduleName,
          methodName,
          module: resolved.module,
          namespace: objectName,
        });
      }
    }
  } else if (t.isIdentifier(path.node.tag)) {
    const localMethodName = path.node.tag.name;
    const binding = path.scope.getOwnBinding(localMethodName);
    if (binding) {
      const resolved = resolveSpecifierImport(t, binding);
      if (resolved) {
        const { methodName, module } = resolved;
        const moduleName = module.node.source.value;
        fn({ methodName, moduleName, module, namespace: null });
      }
    }
  }
}

/**
 * Find import declaration for binding and resolve original name
 * For example we have next two lines:
 * import { foo as bar } from 'module';
 * const demo = bar``
 *
 * This function allows to resolve `foo` from `bar` usage
 * with import declaration
 */
function resolveSpecifierImport(t, binding) {
  const local = binding.identifier;
  const module = binding.path.find((path) => path.isImportDeclaration());

  if (!module) return null;

  const specifier = module.node.specifiers
    .filter((node) => t.isImportSpecifier(node))
    .find((node) => node.local.name === local.name);

  if (!specifier) return null;

  return { methodName: specifier.imported.name, module };
}

function resolveNamespaceImport(t, binding) {
  const module = binding.path.find((path) => path.isImportDeclaration());
  if (!module) return null;

  const specifier = module.node.specifiers.find((node) =>
    t.isImportNamespaceSpecifier(node),
  );
  if (!specifier) return null;

  return { module, specifier };
}

function determineName(t, path) {
  // TODO: detect when css`` is nested to variants and add simple name `variant-value` without `variants` prefix
  // TODO: detect when css`` is nested to compound and add name `variant1-value1--variant2-value2`
  if (t.isIdentifier(path)) {
    return path.name;
  }
  if (t.isLiteral(path)) {
    return String(path.value);
  }
  if (t.isVariableDeclarator(path.parent) && t.isIdentifier(path.parent.id)) {
    return path.parent.id.name;
  }
  if (t.isObjectExpression(path.parent) || t.isCallExpression(path.parent)) {
    return determineName(t, path.parentPath);
  }
  if (t.isObjectProperty(path.parent)) {
    const local = determineName(t, path.parent.key);
    const determined = determineName(t, path.parentPath);
    if (local && determined) {
      return `${determined}-${local}`;
    }
    if (local) {
      return local;
    }
  }
  return '';
}

function generateStableID(babelRoot, fileName, varName, line, column) {
  const normalizedPath = stripRoot(babelRoot, fileName, false);
  const hash = hashCode(`${varName} ${normalizedPath} [${line}, ${column}]`);
  return `f${hash}`;
}

function stripRoot(babelRoot, fileName, omitFirstSlash) {
  const { sep, normalize } = require('path');
  const rawPath = fileName.replace(babelRoot, '');
  let normalizedSeq = normalize(rawPath).split(sep);
  if (omitFirstSlash && normalizedSeq.length > 0 && normalizedSeq[0] === '') {
    normalizedSeq = normalizedSeq.slice(1);
  }
  return normalizedSeq.join('/');
}

function hashCode(s) {
  let h = 0;
  let i = 0;
  if (s.length > 0)
    while (i < s.length) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  return h.toString(36);
}
