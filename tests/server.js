'use strict';
let connect = require('connect'),
    serveStatic = require('serve-static'),
    history = require('connect-history-api-fallback'),
    server;

server = connect()
        .use(history())
        .use(serveStatic(__dirname + '/../app'));

module.exports = server;
