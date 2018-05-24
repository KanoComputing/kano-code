const url = require('url');
const path = require('path');
const resolve = require('@kano/es6-resolution');

module.exports = (opts = {}) => {
    const root = opts.root || process.cwd();
    return (req, res, next) => {
        if (!res.body) {
            res.statusCode = 404;
            return res.end();
        }
        const reqUrl = url.parse(req.url);
        const filePath = path.join(root, reqUrl.path);
        const mime = res.getHeader('Content-Type');
        const upgradedBody = resolve(res.body, mime, filePath);
        res.end(upgradedBody);
    };
};
