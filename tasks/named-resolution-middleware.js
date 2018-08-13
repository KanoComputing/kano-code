const url = require('url');
const path = require('path');
const resolve = require('@kano/es6-resolution');
const { StringDecoder } = require('string_decoder');
const mime = require('mime');
const textChunk = require('node-text-chunk');

module.exports = (opts = {}) => {
    const root = opts.root || process.cwd();
    const onModule = opts.onModule || function () {};

    return (req, res, next) => {
        const _end = res.end;
        const _on = res.on;
        const _write = res.write;
        const _writeHead = res.writeHead;

        let ended = false;

        let status;

        let upgradedBody;
        let queue;

        const reqUrl = url.parse(req.url);
        const filePath = path.join(root, reqUrl.path);
        const contentType = mime.getType(filePath);
        if (!contentType || (contentType.indexOf('application/javascript') === -1 && contentType.indexOf('text/html') === -1)) {
            return next();
        }
        let buffer = '';
        const decoder = new StringDecoder('utf-8');

        function sendData() {
            if (!queue || !queue.length) {
                return _end.call(res);
            }
            if (_write.call(res, queue.shift())) {
                return sendData();
            }
        }

        function transformAndSend() {
            upgradedBody = resolve(root, buffer, contentType, filePath, reqUrl.path, onModule);
            queue = textChunk.text(upgradedBody, 1024);
            res.setHeader('Content-Length', Buffer.byteLength(upgradedBody, 'utf-8'));
            if (status) {
                _writeHead.call(res, status);
            }
            sendData();
        }

        res.writeHead = function writeHead(statusCode) {
            status = statusCode;
        };

        res.write = function write(chunk) {
            if (ended) {
                return false;
            }

            if (!this._header) {
                this._implicitHeader();
            }

            buffer += decoder.write(chunk);
            return true;
        };
        res.end = function end(chunk, encoding) {
            if (ended) {
                return false;
            }

            if (!this._header) {
                this._implicitHeader();
            }

            // mark ended
            ended = true;

            if (chunk) {
                buffer += decoder.write(chunk);
            }

            transformAndSend();
        };
        _on.call(res, 'drain', () => {
            sendData();
        });
        next();
    };
};
