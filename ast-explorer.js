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
        const derivedName = determineName(t, path);
        const sid = generateStableID(
          '',
          '',
          derivedName,
          path.node.loc.start.line,
          path.node.loc.start.column,
        );
        const fullName = createName(sid, derivedName);
        const tagName = path.node.tag.name;
        const binding = path.scope.getOwnBinding(tagName);
        if (binding) {
          const module = binding.path.find((item) =>
            item.isImportDeclaration(),
          );
          if (module && allowedModules.includes(module.node.source.value)) {
            //path.scope.rename(tagName);
            console.log(path, fullName, module);
            path.replaceWith(
              t.objectExpression([
                t.objectProperty(
                  t.identifier('content'),
                  t.stringLiteral('COMPILED CSS HERE'),
                ),
                t.objectProperty(
                  t.identifier(tagName),
                  t.stringLiteral(fullName),
                ),
              ]),
            );
            // console.log(Object.keys(path.__proto__).sort())
          }
        }
      },
    },
  };
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
