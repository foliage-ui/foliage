/* eslint-disable */
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const nested = require('postcss-nested');
const cssoPlugin = require('postcss-csso');
const csso = require('csso');
const { camelCase } = require('change-case');
const t = require('@babel/types');

const instance = postcss([
  autoprefixer({ overrideBrowserslist: ['last 10 chrome version'] }),
  nested(),
]);

const sample = `
    --woly-vertical: calc(
    1px * var(--woly-component-level) * var(--woly-main-level)
  );
  --woly-horizontal: calc(
    var(--woly-const-m) + (1px * var(--woly-main-level)) + var(--woly-vertical)
  );
  --woly-gap: calc(
    (1px * var(--woly-main-level)) +
      (1px * var(--woly-main-level) * var(--woly-component-level))
  );
  display: flex;
  flex-wrap: nowrap;
  padding: var(--woly-vertical, 16px) var(--woly-horizontal, 6.4px);
  color: var(--woly-color, #ffffff);
  font-size: var(--woly-font-size, 15px);
  line-height: var(--woly-line-height, 24px);
  background-color: var(--woly-background, #000000);
  border-color: var(--woly-border, #000000);
  border-style: solid;
  border-width: var(--woly-border-width, 0);
  border-radius: var(--woly-rounding, 4px);
  &:hover {
    color: var(--woly-color-hover, #ffffff);
    background-color: var(--woly-background-hover, #000000);
    border-color: var(--woly-border-hover, #000000);
    outline: none;
  }
  &:focus,
  &:active {
    color: var(--woly-color-focus, #ffffff);
    background-color: var(--woly-background-focus, #000000);
    border-color: var(--woly-border-focus, #000000);
    outline: none;
  }
  &:disabled {
    color: var(--woly-color-disabled, #ffffff);
    background-color: var(--woly-background-disabled, #000000);
    border-color: var(--woly-border-disabled, #000000);
    outline: none;
  }
  & [data-icon] {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--woly-line-height, 24px);
    height: var(--woly-line-height, 24px);
  }
  & > *:not(:first-child) {
    margin-left: var(--woly-gap);
  }
`;

async function create(css, { filename = 'example.css' } = {}) {
  const hash = hashCode(css);
  const className = `.d${hash}`;
  const source = `${className} { ${css} }`;

  const { css: processed } = await instance.process(source, { from: filename });
  const { css: minified } = csso.minify(processed);
  return { minified, variables };
}

// create(sample).then(console.log, console.error);

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
  return h.toString(36);
}

module.exports = function (babel, options = {}) {
  const foliagePackages = new Set(['foliage']);
  const styledNames = new Set(['styled']);

  const styledCreators = new Set();

  const importVisitor = {
    ImportDeclaration(path, state) {
      const source = path.node.source.value;
      const specifiers = path.node.specifiers;

      if (foliagePackages.has(source)) {
        for (const specifier of specifiers) {
          if (!specifier.imported) continue;

          const importedName = specifier.imported.name;
          const localName = specifier.local.name;
          if (importedName === localName) continue;

          if (styledNames.has(importedName)) {
            styledCreators.add(localName);
          }
        }
      }
    },
  };

  const plugin = {
    name: 'foliage/babel-plugin',
    visitor: {
      Program: {
        enter(path, state) {
          path.traverse(importVisitor, state);
        },
      },
      TaggedTemplateExpression(path) {
        let name = '';
        if (t.isVariableDeclarator(path.parent)) {
          if (t.isIdentifier(path.parent.id)) {
            name = path.parent.id.name;
          }
        }
        if (
          t.isMemberExpression(path.node.tag) &&
          path.node.tag.object.name === 'styled'
        ) {
          const id = generateStableID(
            'world',
            'hello',
            name,
            path.node.loc.start.line,
            path.node.loc.start.column,
          );
          const source = path.node.quasi.quasis[0].value.raw;
          path.replaceWith(
            t.callExpression(t.identifier('createComponent'), [
              t.stringLiteral(source),
              t.stringLiteral(id),
            ]),
          );
          // https://astexplorer.net/#/gist/534b12b366f203eb06bc7b23b14e9b5c/207fcdbf1fe32a756920e3e65645cbf66597ec82
        }
      },
    },
  };
};
