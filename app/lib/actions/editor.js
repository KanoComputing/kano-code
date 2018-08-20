import Store from '../store.js';

const CONSTANTS = [
    'SET_TOOLBOX',
    'LOAD_SOURCE',
    'UPDATE_BACKGROUND',
    'SET_FLYOUT_MODE',
    'EDIT_BACKGROUND',
];
const EDITOR_TYPES = Store.types(CONSTANTS);

const EditorActions = (store) => {
    store.addMutator(function modeActions(action) {
        switch (action.type) {
        case EDITOR_TYPES.LOAD_SOURCE: {
            // For performance reasons, we don't update the stringified source
            // Force set value when loading source
            this.set('state.source', null);
            this.set('state.source', action.source);
            break;
        }
        case EDITOR_TYPES.UPDATE_BACKGROUND: {
            this.set('state.background', action.value);
            break;
        }
        case EDITOR_TYPES.SET_TOOLBOX: {
            this.set('state.toolbox', action.toolbox);
            break;
        }
        case EDITOR_TYPES.SET_FLYOUT_MODE: {
            this.set('state.blockly.flyoutMode', action.isFlyoutMode);
            break;
        }
        case EDITOR_TYPES.EDIT_BACKGROUND: {
            this.set('state.editingBackground', action.state);
            this.set('state.selectedPartIndex', null);
            break;
        }
        default: {
            break;
        }
        }
    });

    return {
        loadSource(source) {
            store.dispatch({ type: EDITOR_TYPES.LOAD_SOURCE, source });
        },
        setToolbox(toolbox) {
            store.dispatch({ type: EDITOR_TYPES.SET_TOOLBOX, toolbox });
        },
        setFlyoutMode(isFlyoutMode) {
            store.dispatch({ type: EDITOR_TYPES.SET_FLYOUT_MODE, isFlyoutMode });
        },
        editBackground(state) {
            store.dispatch({ type: EDITOR_TYPES.EDIT_BACKGROUND, state });
        },
    };
};

export default EditorActions;
