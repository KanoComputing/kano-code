import { Store } from '../store.js';

const store = Store;

const CONSTANTS = ['UPDATE_VALUE'];
const CONFIG_TYPES = store.types(CONSTANTS);

store.addMutator(function (action) {
    switch (action.type) {
        case CONFIG_TYPES.UPDATE_VALUE: {
            const value = typeof action.value !== 'undefined' && action.value !== null ? action.value : action.default;
            this.set(`state.config.${action.key}`, value);
            break;
        }
    }
});

export const Config = {
    updateConfigKey (key, value, d) {
        store.dispatch({ type: CONFIG_TYPES.UPDATE_VALUE, key, value, default: d });
    }
};
