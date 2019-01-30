import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GlobalStore } from './global-store.js';

const Store = {
    create(initState : object) {
        const store = GlobalStore.create(initState);

        class StoreElement extends store.StateProvider(PolymerElement) {
            static get is() { return `kc-store-${store.id}`; }
        }

        customElements.define(StoreElement.is, StoreElement);

        const storeElement = new StoreElement();

        store.providerElement = storeElement;

        return store;
    },
    types(constants : string[]) {
        return Object.freeze(constants.reduce<{ [K : string] : string }>((acc, constant) => {
            acc[constant] = constant;
            return acc;
        }, {}));
    },
};

export default Store;
