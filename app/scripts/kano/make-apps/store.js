import FlowDown from 'flow-down/flow-down.js';
import { config as config$0 } from '../../config/default.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';

export const Store = FlowDown.createStore({
    editor: {
        app: null,
        logoutEnabled: !config$0.DISABLE_LOGOUT,
        remixLoadingAlertOpened: false,
    },
    challenge: {
        banner: null,
        history: {
            backBuffer: [],
            forwardBuffer: [],
            ignoreNextStepChange: false,
        },
    },
    story: {},
    routing: {
        context: {},
    },
    user: null,
    config: config$0,
});

Store.types = function types (constants) {
    return Object.freeze(constants.reduce((acc, constant) => {
        acc[constant] = constant;
        return acc;
    }, {}))
};

const KanoCodeStoreElement = Polymer({ is: 'kc-store', behaviors: [Store.ProviderBehavior] });

Store.storeElement = new KanoCodeStoreElement();
Store.getState = () => Store.storeElement.getState();

document.body.appendChild(Store.storeElement);
