import { Store } from '../store.js';

const store = Store;

const CONSTANTS = ['LOAD_REMIX', 'REMIX_LOADED'];
const EDITOR_TYPES = store.types(CONSTANTS);

store.addMutator(function (action) {
    switch (action.type) {
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

export const Editor = {};
