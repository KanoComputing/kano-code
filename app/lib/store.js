import GlobalStore from './global-store.js';
import { PolymerElement } from '@polymer/polymer/polymer-element.js';

const Store = {
    create(initState) {
        const store = GlobalStore.create(initState);

        class StoreElement extends store.StateProvider(PolymerElement) {
            static get is() { return `kc-store-${store.id}`; }
            static get observers() { return ['_runningChanged(state.running)']; }
            _runningChanged() {
                this.dispatchEvent(new CustomEvent('running-changed'), { bubbles: true });
            }
        }

        customElements.define(StoreElement.is, StoreElement);

        const storeElement = new StoreElement();

        store.providerElement = storeElement;

        return store;
    },
    types(constants) {
        return Object.freeze(constants.reduce((acc, constant) => {
            acc[constant] = constant;
            return acc;
        }, {}));
    },
};

export default Store;
