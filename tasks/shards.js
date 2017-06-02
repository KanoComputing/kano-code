let fs = require('fs');
let path = require('path');
let mkdirp = require('mkdirp');
let Vulcan = require('vulcanize');
let Handlebars = require('handlebars');

const parse5 = require('parse5');

const INFO = 0;

function LOG(level, msg) {
    console.log(msg);
}

let TreeUtil = {
    removeChild (node, child) {
        let idx = node.children.indexOf(child);
        if (idx >= 0) {
            node.children.splice(idx, 1);
            child.parent = null;
        }
    },
    getParentBundle (node, inclLazy) {
        if (!node.parent) {
            return node;
        }
        do {
            node = node.parent;
        } while (node.parent && (!node.lazy || inclLazy));
        return node;
    },
    findLeaves (root) {
        let leaves = [];
        function iterate(node) {
            if (node.children && node.children.length) {
                node.children.forEach(iterate);
            } else if (!node.moved) {
                // Leaf
                leaves.push(node);
            }
        }
        iterate(root);
        return leaves;
    }
};

function generateTreeMap(opts) {
    return makeTree(opts).then(root => {
        return new Promise((resolve, reject) => {
            fs.readFile('./tasks/shards-output.hbs', (err, data) => {
                let template, fileContent;
                if (err) {
                    return reject(err);
                }
                template = Handlebars.compile(data.toString());
                function iterate(node) {
                    node.name = node.path;
                    delete node.parent;
                    delete node.endpoint;
                    delete node.path;
                    delete node.lazy;
                    if (node.children && node.children.length) {
                        node.children.forEach(iterate);
                    }
                }
                iterate(root);
                fileContent = template({ tree: `<script>window.tree = ${JSON.stringify(root)}</script>` });
                fs.writeFile('tree.html', fileContent, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                });
            });
        });
    });
}

function makeTree(opts) {
    let root = {};
    root.endpoint = opts.shell;
    root.path = path.join(opts.root, opts.shell);
    return createChildren(root, { root: opts.root }).then(() => {
        return root;
    });
}

function createChildren(node, opts) {
    let dir = path.dirname(node.path);
    return getDependencies(node.path).then(deps => {
        let tasks,
            p;
        node.children = deps;
        tasks = node.children.map(childNode => {
            if (childNode.endpoint.charAt(0) === '/') {
                childNode.path = path.join(opts.root, childNode.endpoint);
            } else {
                childNode.path = path.join(dir, childNode.endpoint);
            }
            childNode.parent = node;
            return childNode;
        }).filter(child => {
            p = node;
            // Lookup the tree to see if the file was already imported in that path before
            while (p) {
                if (!p.parent) {
                    return true;
                }
                if (p.path === child.path) {
                    return false;
                }
                p = p.parent;
            }
            return true;
        }).map(child => {
            return createChildren(child, opts);
        });
        return Promise.all(tasks);
    });
}

function lookForImport(document) {
    let links = [];
    function iterate(node) {
        let isImport, isLazy, hrefValue;
        if (node.tagName === 'link') {
            node.attrs.forEach(attr => {
                if (attr.name === 'rel' && (['import', 'lazy-import'].indexOf(attr.value) !== -1)) {
                    isImport = true;
                    isLazy = (attr.value === 'lazy-import');
                }
                if (attr.name === 'href') {
                    hrefValue = attr.value;
                }
                if (isImport && hrefValue) {
                    links.push({
                        href: hrefValue,
                        lazy: isLazy
                    });
                }
            });
        }
        if (node.childNodes) {
            node.childNodes.forEach(iterate);
        }
    }
    iterate(document);
    return links;
}

let nodeCache = {};

function getDependencies(filePath, ignoreLazy, noCache) {
    if (nodeCache[filePath]) {
        let copy = nodeCache[filePath].map(file => {
            return Object.assign({}, file);
        });
        return Promise.resolve(copy);
    }
    return new Promise((resolve) => {
        let document, files;
        fs.readFile(filePath, (err, file) => {
            let content, size;
            if (err) {
                console.log(`Could not read '${filePath}'`);
                return resolve([]);
            }
            content = file.toString();
            size = content.length;
            document = parse5.parse(content, {
                treeAdapter: parse5.treeAdapters.default
            });
            files = lookForImport(document).map(node => {
                return {
                    endpoint: node.href,
                    lazy: node.lazy,
                    size
                };
            });
            if (!noCache) {
                nodeCache[filePath] = files.slice(0);
            }
            return resolve(files);
        });
    });
}

function getAllByPath(node, path) {
    let results = [];
    function iterate(node) {
        if (node.path === path) {
            results.push(node);
        }
        if (node.children && node.children.length) {
            node.children.forEach(n => iterate(n));
        }
    }
    iterate(node);
    return results;
}

function bundleLeaf(leaf, similar) {
    let lowestCommonNode,
        longestPath,
        parentsPath,
        it,
        p;
    // Create the dependencies path for each similar node e.g.
    // ['a.html', 'b.html', 'c.html']
    // ['a.html', 'b.html', 'c.html']
    // ['e.html', 'd.html', 'c.html']
    let paths = similar.reduce((acc, l) => {
        parentsPath = [];
        p = l;
        do {
            p = TreeUtil.getParentBundle(p);
            parentsPath.unshift(p);
        } while (p.parent);
        acc.push(parentsPath);
        return acc;
    }, []);

    // Grab the longest dependency path of all the similar nodes
    longestPath = paths.reduce((acc, p) => acc < p.length ? p.length : acc, 0);

    // Start iterating at the end of the path
    it = longestPath - 1;

    // Move up towards the root if not all the paths are the same
    while (it > 0 && !paths.every(p => p[it] && p[it].path === paths[0][it].path)) {
        it--;
    }

    // All the paths are the same, this is the lowest common ancestor in the tree
    lowestCommonNode = paths[0][it];

    // Remove the bundle node if all of its children have been processed. A reference to the node is kept in `endpoints`
    if (lowestCommonNode.parent && lowestCommonNode.children.every(c => c.moved)) {
        TreeUtil.removeChild(lowestCommonNode.parent, lowestCommonNode);
    }

    return lowestCommonNode.path;
}

function generateBundleContent(bundlePath, deps) {
    let dir = path.dirname(bundlePath),
        files = deps.map(c => c.path),
        fileContent, tmpBundlePath, extension, fd, url

    files.push(bundlePath);

    fileContent = files.reduce((acc, dep) => {
        url = path.relative(dir, dep);
        return acc += `<link rel="import" href="${url}">\n`;
    }, '');

    tmpBundlePath = bundlePath.split('.');
    extension = tmpBundlePath.pop();

    tmpBundlePath.push('bundle');
    tmpBundlePath.push(extension);
    tmpBundlePath = tmpBundlePath.join('.');

    mkdirp.sync(dir);
    fd = fs.openSync(tmpBundlePath, 'w');
    fs.writeSync(fd, fileContent);
    return tmpBundlePath;
}

function getAllEndpoints(root) {
    let endpoints = [];
    function iterate(node) {
        if (node.lazy && endpoints.map(e => e.path).indexOf(node.path) === -1) {
            endpoints.push(node);
        }
        if (node.children && node.children.length) {
            node.children.forEach(iterate);
        }
    }
    iterate(root);
    return endpoints;
}

function build(opts) {
    return makeTree(opts).then(node => {
        let leaves = TreeUtil.findLeaves(node),
            endpoints = getAllEndpoints(node),
            similar, bundles = {}, found, copy;

        endpoints.forEach(endpoint => {
            bundles[endpoint.path] = [];
        });

        while (leaves[0] && leaves[0] !== node) {
            // Grab all nodes referencing the same file
            similar = getAllByPath(node, leaves[0].path);
            // Find the bundle the file belongs to
            found = bundleLeaf(leaves[0], similar);
            // Add a copy of the leaf to the bundle registery
            bundles[found] = bundles[found] || [];
            copy = Object.assign({}, leaves[0]);
            copy.parent = null;
            if (bundles[found].map(node => node.path).indexOf(copy.path) === -1) {
                bundles[found].push(copy);
            }
            // Remove all the similar nodes from the tree as the bundle was found
            similar.forEach(l => {
                if (l.parent) {
                    TreeUtil.removeChild(l.parent, l);
                }
            });

            leaves = TreeUtil.findLeaves(node);
            leaves.forEach(leaf => {
                if (leaf.lazy) {
                    TreeUtil.removeChild(leaf.parent, leaf);
                }
            });
            leaves = TreeUtil.findLeaves(node);
        }

        if (opts.debug) {
            Object.keys(bundles).forEach(key => {
                console.log(key);
                console.log(bundles[key].map(dep => `\t|${dep.path}`).join('\n'));
            });
        }

        return bundles;
    }).then(bundles => {
        return Promise.all(Object.keys(bundles).map(bundlePath => {
            // Generate temporary files containing the bundles' dependencies
            return generateBundleContent(bundlePath, bundles[bundlePath]);
        })).then((files) => {
            // Grab the tree again
            return makeTree(opts).then(root => {
                let deps = [];
                // Get all dependencies from the tree as an array of path
                function iterate(node) {
                    if (deps.indexOf(node.path) === -1) {
                        deps.push(node.path);
                    }
                    if (node.children && node.children.length) {
                        node.children.forEach(iterate);
                    }
                }
                iterate(root);
                return deps;
            }).then(deps => {
                return Promise.all(Object.keys(bundles).map((bundlePath, index) => {
                    return new Promise((resolve, reject) => {
                        let needed = bundles[bundlePath].map(c => c.path),
                            exclude, vulcan, fd, absPath, relPath;
                        needed.push(bundlePath);
                        // Exclude contains all the dependencies except the one needed. This tricks vulcanize into only bundling what we tell it to
                        exclude = deps.filter(path => needed.indexOf(path) === -1);
                        absPath = path.resolve(opts.root);
                        relPath = path.relative(absPath, files[index]);
                        vulcan = new Vulcan({
                            abspath: absPath,
                            inlineScripts: true,
                            inlineCss: true,
                            stripExcludes: exclude.map(p => path.relative(absPath, p)),
                            stripComments: true
                        });

                        vulcan.process(relPath, (err, doc) => {
                            if (err) {
                                reject(err);
                            } else {
                                let outPath = path.join(opts.dest, path.relative(opts.root, bundlePath));
                                mkdirp.sync(path.dirname(outPath));
                                fd = fs.openSync(outPath, 'w');
                                fs.writeSync(fd, doc);
                                resolve();
                            }
                        });
                    });
                }));
            });
        });
    }).catch(err => {
        throw err;
    });
}

module.exports = {
    build,
    generateTreeMap
};
