import { IPartAPI } from '../../api.js';
import { SequencerPart } from './sequencer.js';
import { speaker } from '@kano/icons/parts.js';
import { FieldSequence } from './blockly/field-sequence.js';
import { Block, Blockly } from '@kano/kwc-blockly/blockly.js';
import Editor from '../../../editor/editor.js';
import { BlocklySourceEditor } from '../../../editor/source-editor/blockly.js';

export const SequencerAPI : IPartAPI = {
    type: SequencerPart.type,
    label: 'Sequencer',
    color: '#ef5284',
    icon: speaker,
    symbols: [{
        type: 'function',
        name: 'onHit',
        verbose: '',
        parameters: [{
            type: 'parameter',
            name: 'sequence',
            verbose: '',
            blockly: {
                customField() {
                    return new FieldSequence(null);
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
                block.setPreviousStatement(false);
                block.setNextStatement(false);
                (block as any).mutationToDom = function() {
                    const container = document.createElement('mutation');
                    const field = this.getField('SEQUENCE');
                    const data = field._steps.map((isOn : boolean) => isOn ? '1' : '0').join('')
                    container.setAttribute('steps', data);
                    return container;
                };
                (block as any).domToMutation = function (container : SVGElement) {
                    const data = container.getAttribute('steps');
                    if (!data) {
                        return;
                    }
                    const field = this.getField('SEQUENCE') as FieldSequence;
                    const config = data.split('').map(item => item === '1');
                    field.setSteps(config);
                };
            },
        },
    }],
    onInstall(editor : Editor, part : SequencerPart) {
        if (editor.sourceType !== 'blockly') {
            return;
        }
        const blockType = `${part.id}_onHit`;
        const sourceEditor = editor.sourceEditor as BlocklySourceEditor;
        const workspace = sourceEditor.getWorkspace();
        workspace.addChangeListener((e) => {
            if (e.type !== Blockly.Events.CREATE || e.blockType !== blockType) {
                return;
            }
            const block = workspace.getBlockById(e.blockId)!;
            const field = block.getField('SEQUENCE') as FieldSequence;
            field.onDidChangeSteps(() => {
                const seq = part.sequencers.get(field.__id);
                if (!seq) {
                    return;
                }
                seq.setSteps(field.getSteps());
            });
        });
        part.onDidStep((e) => {
            const field = FieldSequence.map.get(e.id);
            field.setCurrentStep(e.column);
        });
    },
};