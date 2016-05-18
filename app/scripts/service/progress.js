let progressService = (sdk) => {
    let loadDebouncer = null,
        neverLoaded = true,
        progress = {};

    const LOAD_DEBOUNCE_DELAY = 3000;

    localStorage.progress = localStorage.progress || JSON.stringify({});

    function formatProgressGroup(group) {
        group = group || {};
        group.storyNo = group.storyNo || 0;
        group.extensions = group.extensions || [];
        return group;
    }

    let progressService = {

        updateProgress (group, storyNo, extension) {
            let progressGroup;

            this.loadFromStorage();
            progressGroup = formatProgressGroup(progress[group]);
            if (extension && progressGroup.extensions.indexOf(extension) === -1) {
                progressGroup.extensions.push(extension);
            }

            progressGroup.storyNo = storyNo;

            this.saveToStorage();

            return this.saveToRemote();
        },

        saveToRemote () {
            let p = Promise.resolve(progress);
            // If the user is authenticated, we can proceed, otherwise the saved progress will be resolved
            if (sdk.auth.getUser()) {
                p = new Promise((resolve, reject) => {
                    // Update the values
                    sdk.appStorage.set('make-apps', { progress }, (err, data) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(data.stats['make-apps'].progress);
                    });
                }).catch(() => {
                    // Whatever happens, return the current value
                    return progress;
                });
            }
            return p;
        },

        loadProgress () {
            let p;
            // Load values from local storage
            this.loadFromStorage();
            p = Promise.resolve(progress);

            // Sync if the user is logged
            if (sdk.auth.getUser()) {
                return this.sync();
            }
            return p;
        },
        sync () {
            let p = Promise.resolve(progress),
                loadFromRemote = new Promise((resolve, reject) => {
                    let needUpdate = false;
                    sdk.appStorage.get('make-apps', (err, data) => {
                        let keys;
                        // Silent error
                        if (err) {
                            return reject(err);
                        }
                        keys = Object.keys(progress);
                        data.progress = data.progress || {};

                        // Add missing groups from remote
                        Object.keys(data.progress).forEach((key) => {
                            if (keys.indexOf(key) === -1) {
                                keys.push(key);
                            }
                        });
                        keys.forEach((group) => {
                            let prGroup = progress[group],
                                remoteGroup = data.progress[group];

                            // The local data is more advanced than the remote one. We keep the local data and raise the `needUpdate` flag
                            // this might create problems if we have different users on the same device though
                            if (!prGroup && remoteGroup) {
                                progress[group] = remoteGroup;
                            } else if (!remoteGroup ||
                                    (prGroup.storyNo > remoteGroup.storyNo || prGroup.extensions.length > remoteGroup.extensions.length)) {
                                needUpdate = true;
                            } else {
                                progress[group] = remoteGroup;
                            }
                        });
                        if (needUpdate) {
                            return this.saveToRemote();
                        } else {
                            this.saveToStorage();
                            return resolve(progress);
                        }
                    });
                });
            // First time in this session that we need the remote data. fetch and return it
            if (neverLoaded) {
                return loadFromRemote.then((progress) => {
                    neverLoaded = false;
                    return progress;
                });
            } else {
                // The data is probably fresh, return the saved progress and defer the local update
                clearTimeout(loadDebouncer);
                loadDebouncer = setTimeout(() => {
                    loadFromRemote.then(() => {});
                }, LOAD_DEBOUNCE_DELAY);
            }
            return p;
        },
        saveToStorage () {
            localStorage.progress = JSON.stringify(progress);
        },
        loadFromStorage () {
            progress = JSON.parse(localStorage.progress) || {};

            // Format each group
            Object.keys(progress).forEach((group) => {
                progress[group] = formatProgressGroup(progress[group]);
            });
        }
    };

    return progressService;
};

export default progressService;
