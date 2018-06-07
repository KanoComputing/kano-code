import FlowDown from 'flow-down/flow-down.js';
import ArraySelector from 'flow-down/plugin/array-selector.js';

const StoreFactory = {
    create(initState) {
        const store = FlowDown.createStore(initState);

        ArraySelector(store);

        const { getStoreId } = store.ReceiverBehavior;

        // If a store id is declared in the element,
        // it is used as a library and the store is managed by the library API
        const EnhancedBehavior = {
            properties: {
                storeId: Number,
            },
            getStoreId() {
                return this.storeId || getStoreId();
            },
        };

        const EnhancedMixin = parent => class extends parent {
            getStoreId() {
                return this.storeId || getStoreId();
            }
        };

        const { StateReceiver } = store;

        store.ReceiverBehavior = [store.ReceiverBehavior, EnhancedBehavior];
        store.StateReceiver = parent => EnhancedMixin(StateReceiver(parent));

        return store;
    },
};

export const Store = StoreFactory.create({});
