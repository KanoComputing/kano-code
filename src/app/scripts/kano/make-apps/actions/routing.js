import { Store } from '../store.js';

const store = Store;

const CONSTANTS = ['UPDATE_CONTEXT', 'UPDATE_PAGE'];
const TYPES = store.types(CONSTANTS);

store.addMutator(function (action) {
    switch (action.type) {
        case TYPES.UPDATE_CONTEXT: {
            this.set('state.routing.context', action.context);
            break;
        }
        case TYPES.UPDATE_PAGE: {
            this.set('state.routing.page', action.page);
            break;
        }
    }
});

export const Routing = {};
