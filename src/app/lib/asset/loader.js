import AudioParser from './parsers/audio.js';
import JSONParser from './parsers/json.js';
import TextParser from './parsers/text.js';

const middlewares = [];

class AssetLoader {
    constructor(root) {
        this.root = root;
        this.clearCache();
    }
    static addMiddleware(test, parser) {
        middlewares.push({ test, parser });
    }
    getUrl(id) {
        return `${this.root}${id}`;
    }
    getAsset(id) {
        const url = this.getUrl(id);
        let cachedPromise = this.get(url);
        if (!cachedPromise) {
            cachedPromise = AssetLoader.load(url);
            this.set(url, cachedPromise);
            cachedPromise.catch((err) => {
                if (err) {
                    // Invalidate the cache in case the request failed
                    this.set(url, null);
                }
            });
        }
        return cachedPromise;
    }
    static load(url) {
        const parser = AssetLoader.getParser(url);
        return fetch(url)
            .then(r => parser(r));
    }
    static getParser(url) {
        for (let i = 0; i < middlewares.length; i += 1) {
            if (middlewares[i].test.test(url)) {
                return middlewares[i].parser;
            }
        }
        return null;
    }
    get(url) {
        return this.cache.get(url);
    }
    set(url, promise) {
        this.cache.set(url, promise);
    }
    clearCache() {
        this.cache = new Map();
    }
}

AssetLoader.addMiddleware(AudioParser.test, AudioParser.parser);
AssetLoader.addMiddleware(JSONParser.test, JSONParser.parser);
AssetLoader.addMiddleware(TextParser.test, TextParser.parser);

export { AssetLoader };
export default AssetLoader;
