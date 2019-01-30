import FlowDown from 'flow-down/flow-down.js';
import ArraySelector from 'flow-down/plugin/array-selector.js';

declare type Constructor<T> = {
    new(...args: any[]) : T;
}

export const GlobalStore = {
    create(initState : object) {
        const store = FlowDown.createStore(initState);

        ArraySelector(store);

        const { getStoreId } = store.ReceiverBehavior;

        // If a store id is declared in the element,
        // it is used as a library and the store is managed by the library API
        const EnhancedBehavior = {
            storeId: null,
            properties: {
                storeId: Number,
            },
            getStoreId() : number {
                return this.storeId || getStoreId();
            },
        };

        const EnhancedMixin = <B extends Constructor<HTMLElement>>(parent : B) => class extends parent {
            public storeId? : number;
            getStoreId() {
                return this.storeId || getStoreId();
            }
        };

        const { StateReceiver } = store;

        store.ReceiverBehavior = [store.ReceiverBehavior, EnhancedBehavior];
        store.StateReceiver = (parent : HTMLElement) => EnhancedMixin(StateReceiver(parent));

        return store;
    },
};

export default GlobalStore;
