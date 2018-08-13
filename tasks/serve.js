const connect = require('connect');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const livereload = require('connect-livereload');

const namedResolutionMiddleware = require('./named-resolution-middleware');

connect()
    .use(livereload())
    .use(history())
    .use(namedResolutionMiddleware({ modulesDir: '../' }))
    .use(serveStatic(`${__dirname}/../app`))
    .use(serveStatic(`${__dirname}/../`))
    .listen(4000);

console.log('Listening on port 4000');
