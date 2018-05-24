const url = require('url');
const path = require('path');

module.exports = (opts = {}) => {
    const modulesDir = opts.modulesDir || '/node_modules';
    return (req, res, next) => {
        if (!res.body) {
            res.statusCode = 404;
            return res.end();
        }
        if (req.url.indexOf('blockly_compressed.js') !== -1) {
            return res.end(res.body.replace('goog.global=this', 'goog.global=window'));
        }
        if (req.url.indexOf('cross-storage/dist/client.min.js') !== -1) {
            return res.end(res.body.replace('}(this);', '}(window);'));
        }
        if (req.url.indexOf('page.js') !== -1) {
            return res.end(res.body.replace('}(this,', '}(window,'));
        }
        if (req.url.indexOf('md5.js') !== -1) {
            return res.end(res.body.replace('})(this)', '})(window)'));
        }
        if (req.url.indexOf('twemoji-min/2/twemoji.min.js') !== -1) {
            return res.end(res.body.replace('var twemoji=function()', 'window.twemoji=function()'));
        }
        res.body = res.body.replace(/import (.+ from )?'(.+)'/g, (match, g1, g2) => {
            if (g2 && (g2.startsWith('.') || g2.startsWith('/'))) {
                return match;
            }
            const importeeId = path.join(modulesDir, g2);
            return `import ${g1 || ''}'${importeeId}'`;
        });
        res.end(res.body);
    };
};
