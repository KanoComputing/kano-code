const fs = require('fs');
const path = require('path');
const fg = require('fast-glob');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const rename = promisify(fs.rename);

function transformCss() {
    return fg('node_modules/monaco-editor/esm/**/*.css', { cwd: path.join(__dirname, '..') })
        .then((results) => {
            const tasks = results.map((filePath) => {
                const absPath = path.join(__dirname, '..', filePath);
                return readFile(absPath, 'utf-8')
                    .then((content) => {
                        const transformed = `
                        const css = document.createElement('style');
                        css.type = 'text/css';
                        css.textContent = \`${content}\`;
                        document.head.appendChild(css);
                        if (!window.__monacoStylesheets__) {
                            window.__monacoStylesheets__ = [];
                        }
                        window.__monacoStylesheets__.push(css);
                        `;
                        return writeFile(absPath, transformed);
                    }).then(() => rename(absPath, `${absPath}.js`));
            });
            return Promise.all(tasks);
        });
}

function transformJs() {
    return fg('node_modules/monaco-editor/esm/**/*.js', { cwd: path.join(__dirname, '..') })
        .then((results) => {
            const tasks = results.map((filePath) => {
                const absPath = path.join(__dirname, '..', filePath);
                return readFile(absPath, 'utf-8')
                    .then((content) => {
                        const transformed = content.replace(/((?:import|export)(?:["'\s]*(?:[\w*{}\n\r\t, $]+)from\s*)?\s+["'])(.*(?:[@\w_-]+))(["'\s].*;?)$/gm, (match, start, importee, end) => {
                            let newImportee = importee;
                            if (importee.endsWith('.css')) {
                                newImportee += '.js';
                            }
                            return `${start}${newImportee}${end}`;
                        });
                        return writeFile(absPath, transformed);
                    });
            });
            return Promise.all(tasks);
        });
}

transformJs()
    .then(() => transformCss());
