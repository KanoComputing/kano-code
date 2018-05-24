
const loadedModules = new Map();

const Mode = {
    define(id, definition) {
        loadedModules.set(id, definition);
    },
    load(id, url) {
        return import(url)
            .then(() => {
                if (!loadedModules.has(id)) {
                    throw new Error(`Could not find mode '${id}' after loading`);
                }
                return loadedModules.get(id);
            });
    },
};

export default Mode;
