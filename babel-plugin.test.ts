import pluginTester from 'babel-plugin-tester';
import plugin from './babel-plugin';

const fullExample = `
import { css, keyframes, createGlobalStyle } from 'foliage';
const part = css\`
  color: black;
  & > * { padding-left: 1rem; }
\`

const anim = keyframes\`
  0% { transform: rotate(0deg) }
  100% { transform: rotate(180deg) }
\`

const glob = createGlobalStyle\`
  body {
    position: fixed;
    top: 0;
    left: 0;
  }
\`
`;

const namespaceSupport = `
import * as example from 'foliage';
const part = example.css\`
  color: black;
  & > * { padding-left: 1rem; }
\`

const anim = example.keyframes\`
  0% { transform: rotate(0deg) }
  100% { transform: rotate(180deg) }
\`

const glob = example.createGlobalStyle\`
  body {
    position: fixed;
    top: 0;
    left: 0;
  }
\`

const theme = example.vars\`
  --demo: 123px;
\`
`;

const doNotCompilesThirdParty = `
import { css, keyframes, createGlobalStyle } from 'styled-components';
const part = css\`color:black;\`
const anim = keyframes\`from{color: black;} to {color: white;}\`
const glob = createGlobalStyle\`body{display: grid}\`
`;

const cssInterpolationInCss = `
import { css } from 'foliage';
const first = css\`
  color: black;
  & > * { padding-left: 1rem; }
\`
const second = css\`
  color: red;
  & \${first} {
    color: white;
  }
\`
`;

const keyframesInterpolationInCss = `
import { css } from 'foliage';
const anim = keyframes\`
  0% { transform: rotate(0deg) }
  100% { transform: rotate(180deg) }
\`
const element = css\`
  color: red;
  animation: \${anim} 3s infinite;
\`
`;

pluginTester({
  pluginName: 'foliage',
  plugin,
  pluginOptions: { debug: true },
  root: __dirname,
  filename: __filename,
  babelOptions: { filename: __filename },
  snapshot: true,
  tests: {
    cssImportedFromPackage: `import {css} from 'foliage'; const example = css\`color: black\``,
    cssRenamedFromPackage: `import {css as demo} from 'foliage'; const example = demo\`justify-content: center;\``,
    withoutDebugNamesNotAdded: {
      code: `import {css} from 'foliage'; const example = css\`span{display:grid}\``,
      pluginOptions: { debug: false },
    },
    cssImportedFromReact: `import {css} from 'foliage-react'; const demo = css\`.global & { [data-demo="a"] {color: black} }\``,
    keyframesAndGlobalStylesShouldCompile: fullExample,
    varsNotCompiles: `import {vars, css} from 'foliage'; const a = css\`outline: none;\`; const b = vars\`--random: 1px;\``,
    namespaceSupport,
    doNotCompilesThirdParty,
    cssInterpolationInCss,
    keyframesInterpolationInCss,
    prefixAdd: {
      code: fullExample,
      pluginOptions: { prefix: 'prefix', debug: true },
    },
    prefixExistsWithoutDebug: {
      code: fullExample,
      pluginOptions: { prefix: 'prefix', debug: false },
    },
  },
});
