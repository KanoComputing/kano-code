import KanoSharedStorageClient from 'kano-shared-storage-client/kano-shared-storage-client.js';
import 'gamification-engine/dist/gamification-engine.js';
import BrowserStorage from 'gamification-engine/browser.js';
import { Store } from '../../scripts/kano/make-apps/store.js';
import { SDK } from '../../scripts/kano/make-apps/sdk.js';

var GamificationBehavior = {
    attached() {
        const { config } = Store.getState();
        this.sharedStorage = new KanoSharedStorageClient({ sharedStorageURL: config.SHARED_STORAGE_URL });
        this.gamification = new Kano.GamificationEngine.Engine(
            Kano.GamificationEngine.RULES,
            new BrowserStorage({client: this.sharedStorage})
        );
    },
    triggerGamificationEngine(payload) {
        const { config } = Store.getState();
        const sdk = new SDK(config);
        const token = sdk.getToken();

        if (token) {
            let headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Authorization', token);

            return fetch(`${config.API_URL}/progress`, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            }).then(r => r.json());
        } else {
            // Log the event so we can replay it later
            this.sharedStorage.saveProgressEvent(payload);

            // Process it through the local gamification engine
            return this.gamification.start({
                staticUrlPrefix: config.GAMIFICATION_ASSETS_URL_PREFIX
            }).then(() => {
                if (!Array.isArray(payload)) {
                    payload = [payload];
                }
                return this.gamification.transaction(payload);
            }).then((res) => {
                return this.gamification.save().then(() => {
                    return { update: res };
                });
            });
        }
    },
    syncCachedProgress() {
        const { config } = Store.getState();
        const sdk = new SDK(config);
        const token = sdk.getToken();

        // Is logged in?
        if (token) {
            return this.sharedStorage.getProgressEvents().then((events) => {
                try {
                    events = JSON.parse(events);
                } catch (e) {
                    events = [];
                }

                // Upload cached events and delete them along with localGamificationState
                if (events.length > 0) {
                    return this.triggerGamificationEngine(events)
                        .then((res) => {
                            this.sharedStorage.deleteProgressEvents();
                            this.sharedStorage.deleteLocalGamificationState();
                        });
                }
            });
        }

        return Promise.reject(new Error('Not logged in.'));
    }
};

// @polymerBehavior
export { GamificationBehavior };
