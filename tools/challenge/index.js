const chokidar = require('chokidar');
const server = require('http').createServer();
const io = require('socket.io')(server);
const fs = require('fs');

const paths = [];

let selectedFile = null;

function updateFile(p) {
    const n = fs.readFileSync(p, 'utf-8');
    io.emit('change', n);
}

chokidar.watch('*.kch', {
    ignored: /(^|[\/\\])\../,
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
