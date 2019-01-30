import Store from '../store.js';

const CONSTANTS = ['UPDATE_MODE'];
const MODE_TYPES = Store.types(CONSTANTS);

const ModeActions = (store) => {
    store.addMutator(function modeActions(action) {
        switch (action.type) {
        case MODE_TYPES.UPDATE_MODE: {
            this.set('state.mode', action.mode);
            break;
        }
        default: {
            break;
        }
        }
    });

    return {
        updateMode(mode) {
            store.dispatch({
                type: MODE_TYPES.UPDATE_MODE,
                mode,
            });
        },
    };
};

export default ModeActions;
