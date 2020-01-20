const git = require('simple-git')(process.cwd());

const { version } = require('../lerna.json');

git.add('./*').commit(version, { '--amend': null });
