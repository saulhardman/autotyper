import { readdir } from 'fs';
import path from 'path';
import { promisify } from 'util';

import del from 'del';
import camelCase from 'camelcase';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';

import babelConfig from './babel.config.json';

const readDir = promisify(readdir);

const PACKAGES_DIR = path.join(process.cwd(), 'packages');

const builds = {
  modern: [{ format: 'es' }],
  legacy: [{ format: 'cjs' }, { format: 'amd' }, { format: 'umd' }],
  browser: [{ format: 'umd', minify: true }],
};

const globals = {
  autotyper: 'autotyper',
  'component-emitter': 'Emitter',
  jquery: 'jQuery',
};

const getPlugins = buildType =>
  [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),

    json({
      exclude: 'node_modules/**',
      preferConst: true,
    }),

    buildType !== 'modern' &&
      babel({
        babelrc: false,
        exclude: 'node_modules/**',
        ...babelConfig,
      }),

    resolve(),

    commonjs(),
  ].filter(Boolean);

const getBuildPlugins = minify => [
  minify
    ? terser()
    : terser({
        mangle: false,
        compress: false,
        output: {
          beautify: true,
          indent_level: 2,
        },
      }),
  filesize(),
];

const getFilename = (format, minify) => {
  const parts = ['index'];

  if (!minify && format !== 'cjs') {
    parts.push(format);
  }

  if (minify) {
    parts.push('min');
  }

  parts.push('js');

  return parts.join('.');
};

const getExternal = (buildType, dependencies, peerDependencies) => {
  if (buildType === 'browser') {
    return Object.keys(peerDependencies);
  }

  return [...Object.keys(dependencies), ...Object.keys(peerDependencies)];
};

export default async () => {
  const packageNames = await readDir(PACKAGES_DIR);

  const configs = await Promise.all(
    packageNames.map(async name => {
      const dir = path.join(PACKAGES_DIR, name);
      const manifestPath = path.join(dir, 'package.json');
      const { dependencies, peerDependencies = {} } = require(manifestPath);
      const input = path.join(dir, 'src/index.js');
      const outputDir = path.join(dir, 'dist');

      await del(`${outputDir}/*`);

      return Object.entries(builds).map(([buildType, outputs]) => ({
        input,

        plugins: getPlugins(buildType),

        external: getExternal(buildType, dependencies, peerDependencies),

        output: outputs.map(({ format, minify }) => ({
          file: path.join(outputDir, getFilename(format, minify)),
          format,
          name: camelCase(name),
          sourcemap: minify,
          globals,
          exports: 'named',

          plugins: getBuildPlugins(minify),
        })),
      }));
    }),
  );

  return configs.flat();
};
