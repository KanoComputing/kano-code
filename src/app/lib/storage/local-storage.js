import StoragePlugin from './storage.js';

class LocalStoragePlugin extends StoragePlugin {
    read(key) {
        const app = JSON.parse(localStorage.getItem(key));
        return Promise.resolve(app);
    }
    write(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        return Promise.resolve();
    }
}

export default LocalStoragePlugin;
