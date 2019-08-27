import { ApplicationModule } from './app.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { addFlashField, setupFlash } from '../../plugins/flash/flash.js';
import { IAPIDefinition } from '../../meta-api/module.js';
import { _ } from '../../i18n/index.js';
import { CollidableField, IItemData } from './blockly/collidable-field.js';
import { Editor } from '../../editor/editor.js';

export const AppAPI = (editor : Editor) => ({
    type: 'module',
    name: ApplicationModule.id,
    color: '#5fc9f3',
    verbose: _('MODULE_APP', 'App'),
    symbols: [{
        type: 'function',
        name: 'onStart',
        verbose: _('WHEN_APP_STARTS', 'when app starts'),
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
    }, {
        type: 'function',
        name: 'onPartCollision',
        verbose: _('WHILE', 'While'),
        parameters: [{
            type: 'parameter',
            name: 'a',
            verbose: '',
            returnType: 'Part',
            blockly: {
                customField(Blockly, block) {
                    const field = new CollidableField('', () => {
                        const parts = editor.parts.getAddedParts();
                        const items : IItemData[] = [];
                        parts.forEach((partRecord, id) => items.push({ id, label: partRecord.part.name || '' }));
                        return items;
                    });
                    editor.parts.onDidAddPart(() => {
                        field.refresh();
                    });
                    return field;
                },
            },
        }, {
            type: 'parameter',
            name: 'b',
            verbose: 'collides with',
            returnType: 'Part',
            blockly: {
                customField(Blockly, block) {
                    const field = new CollidableField('', () => {
                        const parts = editor.parts.getAddedParts();
                        const items : IItemData[] = [];
                        const a = block.getFieldValue('A');
                        parts.forEach((partRecord, id) => items.push({ id, label: partRecord.part.name || '' }));
                        return items.filter(item => item.id !== a);
                    });
                    editor.parts.onDidAddPart(() => {
                        field.refresh();
                    });
                    return field;
                },
            },
        }, {
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
    }],
    onInstall(editor, mod : ApplicationModule) {
        setupFlash(editor, ApplicationModule.id, mod._onDidPartCollision, 'onPartCollision', (block, collision) => {
            const aId = block.getFieldValue('A');
            const bId = block.getFieldValue('B');
            return aId === collision.a.id && bId === collision.b.id;
        });
    },
} as IAPIDefinition);
