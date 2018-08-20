
const loadedModules = new Map();

function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

const Mode = {
    define(id, definition) {
        loadedModules.set(id, definition);
    },
    load(id, url) {
        return loadScript(url)
            .then(() => {
                if (!loadedModules.has(id)) {
                    throw new Error(`Could not find mode '${id}' after loading`);
                }
                return loadedModules.get(id);
            });
    },
};

export default Mode;
