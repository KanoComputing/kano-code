const fs = require('fs');
const path = require('path');
const mime = require('mime');
const url = require('url');

function serveFile(location, res, next) {
    fs.readFile(location, (err, contents) => {
        if (err) {
            return next();
        }
        res.body = contents.toString();
        const type = mime.getType(location.split('.').pop());
        res.setHeader('Content-Type', type);
        next();
    });
}

module.exports = (opts) => {
    const root = opts.root || process.cwd();
    const index = opts.index || 'index.html';
    const indexLocation = path.join(root, index);
    return (req, res, next) => {
        if (res.body) {
            return next();
        }
        const reqUrl = url.parse(req.url);
        const fileLocation = path.join(root, reqUrl.path);
        if (/.*\..+$/.test(reqUrl.path)) {
            return serveFile(fileLocation, res, next);
        }
        serveFile(indexLocation, res, next);
    };
};
