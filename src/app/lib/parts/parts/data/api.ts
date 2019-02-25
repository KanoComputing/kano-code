import { IMetaDefinition } from '../../../meta-api/module.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { addFlashField, setupFlash } from '../../../plugins/flash/flash.js';
import { DataPart } from './data.js';
import Editor from '../../../editor/editor.js';

export const DataAPI : IMetaDefinition[] = [{
    type: 'function',
    name: 'refresh',
}, {
    type: 'function',
    name: 'onUpdate',
    verbose: 'when updated',
    parameters: [{
        type: 'parameter',
        name: 'callback',
        verbose: '',
        returnType: Function,
    }],
    blockly: {
        postProcess(block : Block) {
            addFlashField(block);
            block.setPreviousStatement(false);
            block.setNextStatement(false);
        },
    },
}];

export function onInstall<T>(editor : Editor, part : DataPart<T>) {
    if (!part.id) {
        return;
    }
    setupFlash(editor, part.id, part.data.updated, 'onUpdate');
}