import { resolve } from 'path';
import pluginResolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { babel } from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import Package from './package.json';

const extensions = ['.mjs', '.tsx', '.ts', '.js', '.json'];

function createBuild(input, format) {
  return {
    input: resolve(__dirname, `src/${input}.ts`),
    output: {
      file: `${input}.${format === 'esm' ? 'mjs' : 'js'}`,
      format,
      plugins: [terser()],
      sourcemap: true,
    },
    plugins: [
      pluginResolve({ extensions }),
      commonjs({ extensions: ['.js'] }),
      typescript({
        tsconfig: './tsconfig.build.json',
      }),
      babel({
        babelHelpers: 'bundled',
        extensions,
        skipPreflightCheck: true,
        babelrc: false,
        ...require('./babel.config').generateConfig({
          isEsm: format === 'esm',
        }),
      }),
    ].filter(Boolean),
    external: ['forest/forest.mjs', 'effector/effector.mjs'].concat(
      Object.keys(Package.peerDependencies),
      Object.keys(Package.dependencies),
    ),
  };
}

const inputs = ['index'];
const formats = ['cjs', 'esm'];

const config = inputs.flatMap((i) => formats.map((f) => createBuild(i, f)));

export default config;
