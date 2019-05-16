import { EventEmitter } from '@kano/common/index.js';
import { IChallengeData } from '../challenge';


export class CreatorDevTools {
    client : any;
    private _onDidChangeFile : EventEmitter<IChallengeData> = new EventEmitter();
    get onDidChangeFile() { return this._onDidChangeFile.event; }

    private _onDidUpdateFiles : EventEmitter<string[]> = new EventEmitter();
    get onDidUpdateFiles() { return this._onDidUpdateFiles.event; }

    private _onDidConnectionStatusChange : EventEmitter<boolean> = new EventEmitter();
    get onDidConnectionStatusChange() { return this._onDidConnectionStatusChange.event; }

    constructor() {}
    connect() {
        return this.loadScript()
            .then(() => {
                this.client = (window as any).io.connect('http://localhost:4113');
                this.client.on('files', (paths : string[]) => {
                    this._onDidUpdateFiles.fire(paths);
                });
                this.client.on('change', (p : any) => {
                    const data = JSON.parse(p) as IChallengeData;
                    this._onDidChangeFile.fire(data);
                });
                this.client.emit('get-files');
                this.client.on('connect', () => this.onConnect());
                this.client.on('reconnect', () => this.onConnect());
                this.client.on('disconnect', () => this.onDisconnect());
                this.client.on('error', () => this.onDisconnect());
            });
    }
    onConnect() {
        this._onDidConnectionStatusChange.fire(true);
    }
    onDisconnect() {
        this._onDidConnectionStatusChange.fire(false);
    }
    loadScript() {
        return new Promise((res, rej) => {
            const script = document.createElement('script');
            script.src = 'http://localhost:4113/socket.io/socket.io.js';
            script.onload = res;
            script.onerror = rej;
            document.head.appendChild(script);
        });
    }
    openFile(path : string) {
        if (!this.client) {
            return;
        }
        this.client.emit('open-file', path);
    }
}