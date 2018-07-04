import Store from '../store.js';

const CONSTANTS = [
    'SET_RUNNING_STATE',
    'SET_TOOLBOX',
    'UPDATE_CODE',
    'LOAD_Source',
    'RESET_EDITOR',
    'UPDATE_BACKGROUND',
    'SET_FLYOUT_MODE',
    'EDIT_BACKGROUND',
];
const EDITOR_TYPES = Store.types(CONSTANTS);

const EditorActions = (store) => {
    store.addMutator(function modeActions(action) {
        switch (action.type) {
        case EDITOR_TYPES.SET_RUNNING_STATE: {
            this.set('state.running', action.state);
            break;
        }
        case EDITOR_TYPES.UPDATE_CODE: {
            this.set('state.code', action.code);
            break;
        }
        case EDITOR_TYPES.LOAD_SOURCE: {
            // For performance reasons, we don't update the stringified source
            // Force set value when loading source
            this.set('state.source', null);
            this.set('state.source', action.source);
            break;
        }
        case EDITOR_TYPES.RESET_EDITOR: {
            const { mode } = this.get('state');
            this.set('state.source', mode.defaultCode);
            this.set('state.code', '');
            this.set('state.addedParts', []);
            this.set('state.background', '');
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
        setRunningState(state) {
            store.dispatch({ type: EDITOR_TYPES.SET_RUNNING_STATE, state });
        },
        updateCode(code) {
            store.dispatch({ type: EDITOR_TYPES.UPDATE_CODE, code });
        },
        loadSource(source) {
            store.dispatch({ type: EDITOR_TYPES.LOAD_SOURCE, source });
        },
        reset() {
            store.dispatch({ type: EDITOR_TYPES.RESET_EDITOR });
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
