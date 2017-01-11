/* eslint-disable global-require, import/no-dynamic-require, no-console */

const fs = require('fs');
const path = require('path');
const without = require('lodash.without');
const del = require('del');
const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const uglify = require('rollup-plugin-uglify');
const camelCase = require('camel-case');
const gzipSize = require('gzip-size');
const prettyBytes = require('pretty-bytes');
const pkg = require('../package.json');

const packagesDir = path.join(__dirname, '../packages');
const corePackageName = 'autotyper';
const auxilliaryPackageNames = without(fs.readdirSync(packagesDir), corePackageName);
const distDir = 'dist';
const defaultFormats = [
  { format: 'es' },
  { format: 'cjs' },
  { format: 'amd' },
  { format: 'umd' },
  { format: 'umd', minify: true },
];
const defaultGlobals = {
  autotyper: 'autotyper',
  'component-emitter': 'Emitter',
  jquery: 'jQuery',
};

function getFilename(format, minify) {
  const parts = ['index'];

  if (!minify && format !== 'cjs') {
    parts.push(format);
  }

  if (minify) {
    parts.push('min');
  }

  parts.push('js');

  return parts.join('.');
}

function build(packageName, formats = defaultFormats) {
  const packageDir = path.join(packagesDir, packageName);
  const packageFile = path.join(packageDir, 'package.json');
  const { name, dependencies, peerDependencies = {} } = require(packageFile);
  const packageDistDir = path.join(packageDir, distDir);
  const entry = path.join(packageDir, 'src/index.js');

  let promise = Promise.resolve();

  // Clean up the output directory
  promise = promise.then(() => del([`${packageDistDir}/*`]));

  // Compile source code into a distributable format with Babel
  formats.forEach(({ format, minify = false }) => {
    promise = promise.then(() => rollup({
      entry,
      external: (minify) ? ['jquery'] : [...Object.keys(dependencies), ...Object.keys(peerDependencies)],
      plugins: [
        json({
          exclude: 'node_modules/**',
          preferConst: true,
        }),
        babel({
          babelrc: false,
          exclude: 'node_modules/**',
          presets: [['env', { modules: false }]],
          plugins: [...pkg.babel.plugins, 'external-helpers'],
        }),
        commonjs(),
        resolve(),
        (!minify && format !== 'es' && uglify({
          mangle: false,
          compress: false,
          output: {
            beautify: true,
            indent_level: 2,
          },
        })),
        (minify && uglify()),
      ],
    }).then(b => b.write({
      dest: `${packageDistDir}/${getFilename(format, minify)}`,
      format,
      indent: '  ',
      sourceMap: minify,
      moduleName: format === 'umd' ? camelCase(name) : undefined,
      globals: defaultGlobals,
    })));
  });

  promise.catch((err) => {
    throw err;
  });

  return promise;
}

build(corePackageName).then(() => {
  const builds = auxilliaryPackageNames.map(packageName => build(packageName));

  return Promise.all(builds);
}).then(() => {
  const readmeSrc = path.join(__dirname, '../README.md');
  const readmeDest = path.join(packagesDir, corePackageName, 'README.md');

  return fs.writeFileSync(readmeDest, fs.readFileSync(readmeSrc, 'utf-8'), 'utf-8');
}).then(() => {
  [corePackageName, ...auxilliaryPackageNames].forEach((name) => {
    const filename = path.join(packagesDir, name, distDir, 'index.min.js');
    const filesize = gzipSize.sync(fs.readFileSync(filename, 'utf8'));

    console.log(`${name}: ${prettyBytes(filesize)}`);
  });
});

module.exports = build;
