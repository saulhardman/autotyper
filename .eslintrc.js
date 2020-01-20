module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  env: {
    es6: true,
    node: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'standard',
    'prettier/standard',
    'plugin:prettier/recommended',
  ],
  rules: {
    'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
    'no-prototype-builtins': 'off',
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
      },
    ],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: 'return' },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        prev: ['block', 'block-like', 'function', 'throw'],
        next: '*',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['block', 'block-like', 'function', 'throw'],
      },
    ],
    'lines-between-class-members': ['error', 'always'],
    'brace-style': 2,
    curly: ['error', 'all'],
  },
};
