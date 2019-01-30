import FlowDown from 'flow-down/flow-down.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';

export const Store = FlowDown.createStore({
    editor: {
        app: null,
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
