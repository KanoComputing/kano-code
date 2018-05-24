import { AudioPlayer } from '../../music/player.js';
import { generators } from './stickers.js';
import { types } from './samples.js';

let cache = {};

export const Cache = {
    getFile (type, name) {
        const url = generators[type](name);
        let cachedPromise = this.get(url);
        if (!cachedPromise) {
            cachedPromise = this.load(types[type], url);
            this.set(url, cachedPromise);
            cachedPromise.catch((err) => {
                if (err) {
                    // Invalidate the cache in case the request failed
                    this.set(url, null);
                }
            });
        }
        return cachedPromise;
    },
    load (type, url) {
        return fetch(url)
            .then(r => {
                switch (type) {
                    case 'audio': {
                        return r.arrayBuffer()
                            .then(data => {
                                return new Promise((resolve, reject) => {
                                    AudioPlayer.context.decodeAudioData(data, (buffer) => {
                                        return resolve(buffer);
                                    });
                                });
                            });
                    }
                    case 'json': {
                        return r.json();
                    }
                    default: {
                        return r.text();
                    }
                }
            });
    },
    get (url) {
        return cache[url];
    },
    set (url, promise) {
        cache[url] = promise;
    },
    clearCache () {
        cache = {};
    }
};
