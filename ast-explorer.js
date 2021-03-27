export default function (babel) {
  const { types: t } = babel;

  const allowedModules = ['foliage', 'foliage-react'];

  function addImport(path, specifier, importPath) {
    const programPath = path.find((path) => path.isProgram());
    const renamed = '1' || programPath.scope.generateUidIdentifier(specifier);
    const [newPath] = programPath.unshiftContainer(
      'body',
      t.importDeclaration(
        [t.importSpecifier(t.identifier(specifier), t.identifier(specifier))],
        t.stringLiteral(importPath),
      ),
    );

    newPath.get('specifiers').forEach((s) => {
      programPath.scope.registerBinding('module', s);
    });

    return specifier;
  }

  return {
    name: 'ast-transform', // not required
    visitor: {
      //VariableDeclarator(path, state) {
      //  path.node.id.name = addImport(path, 'mor', 'mod');
      //  path.scope.rename('mor');
      //},

      TaggedTemplateExpression(path, state) {
        // Find original import for current template tag
        const tagName = path.node.tag.name;
        const binding = path.scope.getOwnBinding(tagName);
        if (binding) {
          const resolved = resolveOriginalImport(t, binding);
          if (resolved) {
            const { module, name } = resolved;
            // Check that template tag imported from supported module
            if (allowedModules.includes(module.node.source.value)) {
              // Create stable unique id with readable name
              const derivedName = determineName(t, path);
              const sid = generateStableID(
                '',
                '',
                derivedName,
                path.node.loc.start.line,
                path.node.loc.start.column,
              );
              const fullName = createName(sid, derivedName);

              //path.scope.rename(name);
              console.log(path, fullName, module);
              path.replaceWith(
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('content'),
                    t.stringLiteral('COMPILED CSS HERE'),
                  ),
                  t.objectProperty(
                    t.identifier(name),
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

  const isImportedByValue = module.node.importKind === 'value';
  if (!isImportedByValue) return null;

  const specifier = module.node.specifiers
    .filter((node) => t.isImportSpecifier(node))
    .find((node) => node.local.name === local.name);

  if (!specifier) return null;

  return { name: specifier.imported.name, module };
}

function createName(sid, determined) {
  if (determined) {
    return `${sid}-${determined}`;
  }
  return sid;
}

function determineName(t, path) {
  if (t.isIdentifier(path)) {
    return path.name;
  }
  if (t.isLiteral(path)) {
    return String(path.value);
  }
  if (t.isVariableDeclarator(path.parent)) {
    if (t.isIdentifier(path.parent.id)) {
      return path.parent.id.name;
    }
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
  const rawPath = fileName.replace(babelRoot, '');
  //let normalizedSeq = normalize(rawPath).split(sep)
  //  if (omitFirstSlash && normalizedSeq.length > 0 && normalizedSeq[0] === '') {
  //    normalizedSeq = normalizedSeq.slice(1)
  //  }
  //  const normalizedPath = normalizedSeq.join('/')
  //return normalizedPath
  return rawPath;
}

function hashCode(s) {
  let h = 0;
  let i = 0;
  if (s.length > 0)
    while (i < s.length) h = ((h << 5) - h + s.charCodeAt(i++)) | 0;
  return h.toString(36);
}
