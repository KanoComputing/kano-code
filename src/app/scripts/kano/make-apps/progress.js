import { SDK } from './sdk.js';
import { Store } from './store.js';
import KanoSharedStorageClient from 'kano-shared-storage-client/kano-shared-storage-client.js';

let loadDebouncer = null,
    neverLoaded = true,
    progress = {},
    storedProgress = localStorage.getItem('progress') || JSON.stringify({});


const { config } = Store.getState();
const sharedStorageWrapper = new KanoSharedStorageClient({ sharedStorageURL: config.SHARED_STORAGE_URL });
// Just grab the cross-storage instance here to support previous API..
let sharedStorage = sharedStorageWrapper._client;
const LOAD_DEBOUNCE_DELAY = 3000;

localStorage.setItem('progress', storedProgress);

function formatProgressGroup(group) {
    group = group || {};
    group.storyNo = group.storyNo || 0;
    group.extensions = group.extensions || [];
    group.completedStories = group.completedStories || [];
    return group;
}

class Progress {

    constructor(config) {
        this.config = config;
        this.sdk = new SDK(this.config);
    }

    reset () {
        progress = {};
        this.saveToStorage();
    }

    updateProgress (group, storyNo, extension, storyId=null) {
        let progressGroup;

        this.loadFromStorage();
        progressGroup = formatProgressGroup(progress[group]);
        if (extension && progressGroup.extensions.indexOf(extension) === -1) {
            progressGroup.extensions.push(extension);
        }

        progressGroup.storyNo = storyNo;

        progress[group] = progressGroup;
        if (storyId) {
            progress[group].completedStories = progress[group].completedStories || [];
            if (progress[group].completedStories.indexOf(storyId) === -1) {
                progress[group].completedStories.push(storyId);
            }
        }

        this.saveToStorage();

        return this.saveToRemote();
    }

    saveToRemote () {
        let p = Promise.resolve(progress);
        // If the user is authenticated, we can proceed, otherwise the saved progress will be resolved
        if (this.sdk.getToken()) {
            p = this.sdk.setAppStat('make-apps', { progress }, (data) => {
                return data.stats['make-apps'].progress;
            })
            .catch(err => progress);
        }
        return p;
    }

    loadProgress () {
        let p;
        // Load values from local storage
        this.loadFromStorage();
        p = Promise.resolve(progress);

        // Sync if the user is logged
        if (this.sdk.getUser()) {
            return this.sync();
        }
        return p;
    }
    sync () {
        let p = Promise.resolve(progress),
            loadFromRemote = new Promise((resolve, reject) => {
                let needUpdate = false;
                this.sdk.getAppStat('make-apps').then((data) => {
                    let keys;
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
    }
    recordOnboarding () {
        sharedStorage.onConnect().then(function () {
            return sharedStorage.set('onboarding', true);
        });
    }
    saveToStorage () {
        let progressString = JSON.stringify(progress);
        localStorage.setItem('progress', progressString);
        sharedStorage.onConnect().then(function () {
            return sharedStorage.set('progress', progressString);
        });
    }
    loadFromStorage () {
        try {
            progress = JSON.parse(localStorage.getItem('progress')) || {};
        } catch (e) {
            progress = {};
        }

        // Format each group
        Object.keys(progress).forEach((group) => {
            progress[group] = formatProgressGroup(progress[group]);
        });
    }
}

export { Progress };
