const chokidar = require('chokidar');
const server = require('http').createServer();
const io = require('socket.io')(server);
const fs = require('fs');
const path = require('path');

const paths = [];

let selectedFile = null;

const root = path.resolve(process.argv[2] || '');

function updateFile(p) {
    const n = fs.readFileSync(getPath(p), 'utf-8');
    io.emit('change', n);
}

function getPath(p) {
    return path.join(root, p);
}

chokidar.watch('*.kch', {
    ignored: /(^|[\/\\])\../,
    cwd: root,
}).on('change', (p) => {
    if (p !== selectedFile) {
        return;
    }
    updateFile(p);
}).on('add', (p) => {
    paths.push(p);
    io.emit('files', paths);
});

io.on('connection', client => {
    client.on('get-files', () => {
        io.emit('files', paths);
    });
    client.on('open-file', (path) => {
        selectedFile = path;
        updateFile(selectedFile);
    });
    client.on('disconnect', () => { /* … */ });
});

server.listen(4113);
