import Store from '../store.js';

const CONSTANTS = [
    'SET_RUNNING_STATE',
    'UPDATE_CODE',
    'LOAD_Source',
    'RESET_EDITOR',
    'SELECT_PART',
    'UPDATE_PART',
    'UPDATE_BACKGROUND',
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
        case EDITOR_TYPES.LOAD_Source: {
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
        case EDITOR_TYPES.SELECT_PART: {
            this.set('state.selectedPartIndex', action.index);
            if (action.index === null) {
                this.set('state.selectedPart', null);
            } else {
                this.set('state.selectedPart', this.get(`state.addedParts.${action.index}`));
            }
            break;
        }
        case EDITOR_TYPES.UPDATE_PART: {
            const index = this.get('state.selectedPartIndex');
            this.set(`state.selectedPart.${action.property}`, action.value);
            store.appStateComponent.notifyPath(`state.addedParts.${index}.${action.property}`);
            break;
        }
        case EDITOR_TYPES.UPDATE_BACKGROUND: {
            this.set('state.background', action.value);
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
            store.dispatch({ type: EDITOR_TYPES.LOAD_Source, source });
        },
        reset() {
            store.dispatch({ type: EDITOR_TYPES.RESET_EDITOR });
        },
    };
};

export default EditorActions;
