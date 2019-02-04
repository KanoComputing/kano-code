import Store from '../store.js';
import FlowDown from 'flow-down/flow-down.js';

const CONSTANTS = [
    'UPDATE_PART_LIST',
    'ADD_PART',
    'REMOVE_PART',
    'LOAD_ADDED_PARTS',
    'SELECT',
    'UPDATE',
];
const PARTS_TYPES = Store.types(CONSTANTS);

const PartsActions = (store : FlowDown.Store) => {
    store.addMutator(function partsActions(action) {
        switch (action.type) {
        case PARTS_TYPES.UPDATE_PART_LIST: {
            const mode = this.get('state.mode');
            const partsMap = action.parts.reduce((acc : any, part : any) => {
                acc[part.type] = part;
                return acc;
            }, {});
            this.set('state.partsMap', partsMap);
            if (mode) {
                const parts = action.parts.filter((part : any) => mode.parts.indexOf(part.type) !== -1);
                this.set('state.parts', parts);
            }
            break;
        }
        case PARTS_TYPES.ADD_PART: {
            this.push('state.addedParts', action.part);
            break;
        }
        case PARTS_TYPES.REMOVE_PART: {
            const { addedParts } = this.get('state');
            const index = addedParts.indexOf(action.part);
            this.splice('state.addedParts', index, 1);
            break;
        }
        case PARTS_TYPES.LOAD_ADDED_PARTS: {
            this.set('state.addedParts', action.parts);
            break;
        }
        case PARTS_TYPES.SELECT: {
            this.set('state.selectedPartIndex', action.index);
            if (action.index !== null) {
                this.set('state.editingBackground', false);
            }
            break;
        }
        case PARTS_TYPES.UPDATE: {
            const index = this.get('state.selectedPartIndex');
            this.set(`state.addedParts.${index}.${action.property}`, action.value);
            // FIXME: Maybe flowdown should notify properties that changes all the time
            store.appStateComponent.notifyPath(`state.addedParts.${index}.${action.property}`);
            break;
        }
        default: {
            break;
        }
        }
    });

    return {
        updatePartsList(parts : any[]) {
            store.dispatch({ type: PARTS_TYPES.UPDATE_PART_LIST, parts });
        },
        addPart(part : any) {
            store.dispatch({ type: PARTS_TYPES.ADD_PART, part });
        },
        removePart(part : any) {
            store.dispatch({ type: PARTS_TYPES.REMOVE_PART, part });
        },
        loadAddedParts(part : any) {
            store.dispatch({ type: PARTS_TYPES.LOAD_ADDED_PARTS, part });
        },
        select(index : number) {
            store.dispatch({ type: PARTS_TYPES.SELECT, index });
        },
        updatePart(property : string, value : any) {
            store.dispatch({ type: PARTS_TYPES.UPDATE, property, value });
        },
    };
};

export default PartsActions;
