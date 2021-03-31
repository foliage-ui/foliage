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

  function compile(source, file = 'source.css') {
    const result = compiler.process(source, { from: file });
    const compiled = result.css;
    return csso.minify(compiled).css;
  }

  return {
    name: 'ast-transform', // not required
    visitor: {
      //VariableDeclarator(path, state) {
      //  path.node.id.name = addImport(path, 'mor', 'mod');
      //  path.scope.rename('mor');
      //},

      TaggedTemplateExpression(path, state) {
        if (
          t.isMemberExpression(path.node.tag) &&
          t.isIdentifier(path.node.tag.object) &&
          t.isIdentifier(path.node.tag.property)
        ) {
          // Check that tag.object is a `* as import from 'foliage'`
          // And property is supported method for compilation
        }
        // Find original import for current template tag
        const tagName = path.node.tag.name;
        const binding = path.scope.getOwnBinding(tagName);
        if (binding) {
          const resolved = resolveOriginalImport(t, binding);
          if (resolved) {
            const { module, methodName } = resolved;
            // Check that template tag imported from supported module
            // And method from module should be compiled
            if (
              allowedModules.includes(module.node.source.value) &&
              allowedMethods.includes(methodName)
            ) {
              // Create stable unique id with readable name
              const derivedName = determineName(t, path);
              const sid = generateStableID(
                '',
                '',
                derivedName,
                path.node.loc.start.line,
                path.node.loc.start.column,
              );
              const fullName = nameCreate(sid, derivedName);

              //path.scope.rename(name);

              let output = '/*INTERPOLATION IS NOT SUPPORTED YET*/';

              // Process only tagged literals without interpolations
              if (path.node.quasi.quasis.length === 1) {
                const source = path.node.quasi.quasis[0].value.raw;
                const withClass = createContainer(source, methodName, fullName);
                output = compile(withClass);
              }

              path.replaceWith(
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('content'),
                    t.stringLiteral(output),
                  ),
                  t.objectProperty(
                    t.identifier(methodName),
                    t.stringLiteral(fullName),
                  ),
                ]),
              );
              // console.log(Object.keys(path.__proto__).sort())
            }
          }
        }
      },
    },
  };
};

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
 * Find import declaration for binding and resolve original name
 * For example we have next two lines:
 * import { foo as bar } from 'module';
 * const demo = bar``
 *
 * This function allows to resolve `foo` from `bar` usage
 * with import declaration
 */
function resolveOriginalImport(t, binding) {
  const local = binding.identifier;
  const module = binding.path.find((path) => path.isImportDeclaration());

  if (!module) return null;

  const specifier = module.node.specifiers
    .filter((node) => t.isImportSpecifier(node))
    .find((node) => node.local.name === local.name);

  if (!specifier) return null;

  return { methodName: specifier.imported.name, module };
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
  if (t.isObjectExpression(path.parent)) {
    return determineName(t, path.parentPath);
  }
  if (t.isObjectProperty(path.parent)) {
    const local = determineName(t, path.parent.key);
    const determined = determineName(t, path.parentPath);
    if (local && determined) {
      return `${determined}-${local}`;
    }
  }
}

function generateStableID(babelRoot, fileName, varName, line, column) {
  const normalizedPath = stripRoot(babelRoot, fileName, false);
  return hashCode(`${varName} ${normalizedPath} [${line}, ${column}]`);
}

function stripRoot(babelRoot, fileName, omitFirstSlash) {
  //  const {sep, normalize} = require('path')
  return fileName.replace(babelRoot, '');
}

function hashCode(s) {
  let h = 0;
  let i = 0;
  if (s.length > 0)
    while (i < s.length) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  const d = h < 0 ? (-1 * h) << 5 : h;
  return d.toString(36);
}
