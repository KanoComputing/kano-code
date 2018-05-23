const url = require('url');
const path = require('path');

module.exports = (opts = {}) => {
    const modulesDir = opts.modulesDir || '/node_modules';
    return (req, res, next) => {
        if (!res.body) {
            next();
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
