class NativeWebSocket {
    constructor(url) {
        url = url.replace('http', 'ws');

        this._socket = new WebSocket(url);
        this._listeners = {};
        this.connected = false;

        this._socket.onopen = () => {
            this.connected = true;
            this._startHeartbeat();
            this._listeners['connect'].forEach(callback => {
                callback();
            });
        };

        this._socket.onclose = () => {
            this.connected = false;
            this._listeners['disconnect'].forEach(callback => {
                callback();
            });
        };

        this._socket.onmessage = (message) => {
            let messageData = message.data;
            if (typeof messageData === 'string') {
                messageData = JSON.parse(message.data.toString().replace(/\0/g, ""));
            }
            switch(messageData.type) {
                case 'rpc-response':
                    if (this._listeners[message.id]) {
                        this._listeners[message.id].forEach(cb => {
                            cb(message.value);
                        });
                    }
                    break;
                case 'event':
                    if (this._listeners[messageData.name]) {
                        this._listeners[messageData.name].forEach(cb => {
                            cb(messageData.detail);
                        });
                    }
                    break;
                default:
                    break;
            }
        };
    }

    on(event, callback) {
        if (this._listeners[event]) {
            this._listeners[event].push(callback);
        } else {
            this._listeners[event] = [callback];
        }
    }

    emit(name, params) {
        if (this.connected) {
            // TODO: Refactor!
            // RPC over websockets is not needed, we don't need to check if the frame appeared or not
            // because we don't have the power to restart any of the possible partrs which could fix the issue
            this._socket.send(JSON.stringify({
                "id": Math.floor(Math.random() * 1000).toString(),
                "method" : name,
                "params": [params],
                "type": "rpc-request"
            }));
        }
    }

    removeListener(event, callback) {
        let listenerIndex = (this._listeners[event]) ? this._listeners[event].indexOf(callback) : 0;
        if (listenerIndex) {
            this._listeners[event].splice(listenerIndex, 1);
        }
    }

    removeAllListeners() {
        this._listeners = {};
    }

    _stopHeartbeat() {
        clearInterval(this._rpkHeartbeat);
    }

    _startHeartbeat() {
        this._stopHeartbeat();
        this._rpkHeartbeat = setInterval(() => {
            // TODO find a way to have this specific to the rpk
            // and not global to every native ws connection
            this.emit('lightboard:init');
        }, 9000);
    }

    close() {
        this._socket.close();
        this._stopHeartbeat();
    }
}

export default NativeWebSocket;
