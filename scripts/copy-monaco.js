const mkdirpCb = require('mkdirp');
const fg = require('fast-glob');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');

const mkdirp = promisify(mkdirpCb);
const copyFile = promisify(fs.copyFile);

const root = path.join(__dirname, '../node_modules');
const vendor = path.join(__dirname, '../dist/vendor');

fg('monaco-editor/esm/vs/**/*', { cwd: root })
    .then((files) => {
        const tasks = files.map((filePath) => {
            const absPath = path.join(root, filePath);
            const destPath = path.join(vendor, filePath);
            return mkdirp(path.dirname(destPath))
                .then(() => copyFile(absPath, destPath));
        });
        return Promise.all(tasks);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
