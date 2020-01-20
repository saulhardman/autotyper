const git = require('simple-git')(process.cwd());

const { version } = require('../lerna.json');

git
  .add('./*')
  .commit(version)
  .addAnnotatedTag(`v${version}`, version);
