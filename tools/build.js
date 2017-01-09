const fs = require('fs');
const del = require('del');
const { rollup } = require('rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const json = require('rollup-plugin-json');
const uglify = require('rollup-plugin-uglify');
const camelCase = require('camel-case');

const pkg = require('../package.json');

function getFilename(format, bundle, minify) {
  const parts = ['index'];

  if (format !== 'cjs') {
    parts.push(format);
  }

  if (bundle) {
    parts.push('pkgd');
  }

  if (minify) {
    parts.push('min');
  }

  parts.push('js');

  return parts.join('.');
}

let promise = Promise.resolve();

// Clean up the output directory
promise = promise.then(() => del(['dist/*']));

// Compile source code into a distributable format with Babel
[
  { format: 'es' },
  { format: 'cjs' },
  { format: 'amd' },
  { format: 'umd' },
  { format: 'umd', bundle: true },
  { format: 'umd', bundle: true, minify: true },
].forEach(({ format, bundle = false, minify = false }) => {
  promise = promise.then(() => rollup({
    entry: 'src/index.js',
    external: (bundle) ? [] : Object.keys(pkg.dependencies),
    plugins: [
      json({
        exclude: 'node_modules/**',
        preferConst: true,
      }),
      babel(Object.assign(pkg.babel, {
        babelrc: false,
        exclude: 'node_modules/**',
        runtimeHelpers: true,
        presets: pkg.babel.presets.map((preset) => {
          if (preset === 'es2015') {
            return ['es2015', { modules: false }];
          }

          return preset;
        }),
      })),
      commonjs(),
      resolve(),
      (minify && uglify()),
    ],
  }).then((b) => b.write({
    dest: `dist/${getFilename(format, bundle, minify)}`,
    format,
    sourceMap: minify,
    moduleName: format === 'umd' ? camelCase(pkg.name) : undefined,
  })));
});

// Copy package.json, LICENSE, and README.md
promise = promise.then(() => {
  delete pkg.devDependencies;
  delete pkg.private;
  delete pkg.scripts;

  fs.writeFileSync('dist/package.json', JSON.stringify(pkg, null, '  '), 'utf-8');
  fs.writeFileSync('dist/LICENSE', fs.readFileSync('LICENSE', 'utf-8'), 'utf-8');
  fs.writeFileSync('dist/README.md', fs.readFileSync('README.md', 'utf-8'), 'utf-8');
});

promise.catch((err) => console.error(err.stack)); // eslint-disable-line no-console
