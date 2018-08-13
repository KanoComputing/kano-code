import { Store } from '../store.js';

const store = Store;

const CONSTANTS = ['UPDATE_LOGOUT_ENABLED', 'LOAD_REMIX', 'REMIX_LOADED'];
const EDITOR_TYPES = store.types(CONSTANTS);

store.addMutator(function (action) {
    switch (action.type) {
        case EDITOR_TYPES.UPDATE_LOGOUT_ENABLED: {
            this.set('state.editor.logoutEnabled', action.enabled);
            break;
        }
        case EDITOR_TYPES.LOAD_REMIX: {
            this.set('state.editor.remixLoadingAlertOpened', true);
            break;
        }
        case EDITOR_TYPES.REMIX_LOADED: {
            this.set('state.editor.remixLoadingAlertOpened', false);
            break;
        }
    }
});

export const Editor = {
    updateLogoutEnabled (enabled) {
        store.dispatch({ type: EDITOR_TYPES.UPDATE_LOGOUT_ENABLED, enabled });
    }
};
