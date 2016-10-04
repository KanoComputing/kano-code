'use strict';
let fs = require('fs');
let path = require('path');
let mkdirp = require('mkdirp');
let Vulcan = require('vulcanize');
let mute = require('mute');
let rimraf = require('rimraf');

function getImports(filePath, opts) {
    let found = [];
    opts = opts || {};

    function crawlImports(filePath) {
        return new Promise((resolve, reject) => {
            let dir = path.dirname(filePath);
            fs.readFile(filePath, (err, file) => {
                if (err) {
                    return resolve();
                }
                found.push(filePath);
                let content = file.toString(),
                importRegex = /<link.*rel="import".*>/gi,
                imports = content.match(importRegex),
                fileRegex,
                files,
                tasks;
                if (!imports) {
                    return resolve();
                }
                fileRegex = /href="(.*)"/,
                files = imports.map((importLine) => {
                    let m = importLine.match(fileRegex);
                    if (m && m[1]) {
                        return path.join(dir, m[1]);
                    }
                    return null;
                }).filter((f) => {
                    if (!f) {
                        return false;
                    }
                    if (found.indexOf(f) === -1) {
                        return true;
                    }
                });
                tasks = files.map((f) => {
                    return crawlImports(f);
                });
                return Promise.all(tasks).then(() => {
                    return resolve(found);
                }).catch(reject);
            });
        });
    }

    return crawlImports(filePath).then((files) => {
        files = files.filter((item, pos, self) => {
            return self.indexOf(item) == pos;
        });
        if (opts.base) {
            files = files.map((filePath) => {
                return path.relative(opts.base, filePath);
            });
        }
        return files;
    });
}

function getCommonDeps(opts) {
    opts = opts || {};
    opts.endpoints = opts.endpoints || [];
    opts.threshold = opts.threshold || 2;
    opts.workdir = opts.workdir || 'tmp';
    opts.dest = opts.dest || 'dist';
    opts.shared_import = opts.shared_import || 'shared.html';
    let tasks = opts.endpoints.map(endpoint => {
        return getImports(path.join(opts.root, endpoint));
    });

    return Promise.all(tasks).then(everything => {
        let common = {},
            depsOverThreshold = [];
        everything.forEach(endpointDepList => {
            endpointDepList.forEach(dep => {
                if (!common[dep]) {
                    common[dep] = 1;
                } else {
                    common[dep] += 1;
                }
            });
        });
        for (let dep in common) {
            if (common[dep] >= opts.threshold) {
                depsOverThreshold.push(dep);
            }
        }
        return depsOverThreshold;
    });
}

function generateShared(commonDeps, opts) {
    let url, fileContent, fd;
    fileContent = commonDeps.reduce((acc, dep) => {
        url = path.relative(opts.workdir, dep);
        return acc += `<link rel="import" href="${url}">\n`;
    }, '');
    mkdirp.sync(opts.workdir);
    fd = fs.openSync(path.join(opts.workdir, 'shared.html'), 'w');
    fs.writeSync(fd, fileContent);
    return commonDeps;
}

function vulcanizeEndpoint(endpoint, commonDeps, opts) {
    return new Promise((resolve, reject) => {
        let outPath = path.join(opts.dest, endpoint),
            outDir = path.dirname(outPath),
            pathToShared = path.relative(outDir, path.join(opts.dest, opts.shared_import)),
            vulcan, fd, unmute;

        vulcan = new Vulcan({
            abspath: null,
            addedImports: [pathToShared],
            stripExcludes: commonDeps,
            inlineScripts: true,
            inlineCss: true,
            inputUrl: path.join(opts.root, endpoint)
        });

        unmute = mute();
        vulcan.process(null, (err, doc) => {
            unmute();
            if (err) {
                reject(err);
            } else {
                mkdirp.sync(outDir);
                fd = fs.openSync(outPath, 'w');
                fs.writeSync(fd, doc);
                resolve(outPath);
            }
        });
    });
}

function vulcanizeSharedImport(opts) {
    return new Promise((resolve, reject) => {
        let outPath = path.join(opts.dest, opts.shared_import),
            outDir = path.dirname(outPath),
            vulcan, fd, unmute;

        vulcan = new Vulcan({
            abspath: null,
            inlineScripts: true,
            inlineCss: true,
            inputUrl: path.join(opts.workdir, 'shared.html')
        });

        unmute = mute();
        vulcan.process(null, (err, doc) => {
            unmute();
            if (err) {
                reject(err);
            } else {
                mkdirp.sync(outDir);
                fd = fs.openSync(outPath, 'w');
                fs.writeSync(fd, doc);
                resolve(outPath);
            }
        });
    });
}

function vulcanizeEndpoints(commonDeps, opts) {
    return Promise.all(opts.endpoints.map(endpoint => vulcanizeEndpoint(endpoint, commonDeps, opts)));
}

function build(opts) {
    return getCommonDeps(opts)
        .then(commonDeps => generateShared(commonDeps, opts))
        .then(commonDeps => vulcanizeEndpoints(commonDeps, opts))
        .then(commonDeps => vulcanizeSharedImport(opts))
        .then(r => {
            rimraf.sync(opts.workdir);
            console.log(r);
        });
}

module.exports = {
    build
};
