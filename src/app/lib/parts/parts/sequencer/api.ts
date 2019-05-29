import { IPartAPI } from '../../api.js';
import { SequencerPart } from './sequencer.js';
import { speaker } from '@kano/icons/parts.js';
import { FieldSequence } from './blockly/field-sequence.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import Editor from '../../../editor/editor.js';
import { BlocklySourceEditor } from '../../../source-editor/blockly.js';
import { FieldSequenceConfig } from './blockly/field-sequence-config.js';
import { Meta } from '../../../meta-api/module.js';
import { onDidCreateBlockType } from '../../../util/blockly.js';
import { SequencerInlineDisplay } from './inline.js';
import { WebAudioTimestamp } from '../../../types.js';

export const SequencerAPI : IPartAPI = {
    type: SequencerPart.type,
    label: 'Sequencer',
    color: '#ef5284',
    icon: speaker,
    inlineDisplay: SequencerInlineDisplay,
    symbols: [{
        type: 'function',
        name: 'createSteps',
        verbose: '',
        parameters: [{
            type: 'parameter',
            name: 'sequence',
            verbose: '',
            blockly: {
                customField() {
                    return new FieldSequence(8);
                },
            },
        }, {
            type: 'function',
            name: 'callback',
            verbose: '',
            returnType: Function,
            parameters: [{
                type: 'parameter',
                name: 'time',
                returnType: Number,
                blockly: {
                    scope: WebAudioTimestamp,
                },
            }],
        }],
        blockly: {
            postProcess(block : Block) {
                // Remove top and bottom pegs
                block.setPreviousStatement(false);
                block.setNextStatement(false);
                // Define mutation data. This will persist and reload the steps data
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
                // Add the config field
                const input = block.getInput('SEQUENCE');
                if (!input) {
                    return;
                }
                const configField = new FieldSequenceConfig('Sequencer', 8);
                input.insertFieldAt(0, configField, 'CONFIG');
            },
            javascript(Blockly : Blockly, block : Block, m : Meta) {
                const method = m.getNameChain('.');
                const statement = Blockly.JavaScript.statementToCode(block, 'CALLBACK');
                const sequenceField = block.getField('SEQUENCE') as FieldSequence;
                const steps = sequenceField.getSteps().map(enabled => enabled ? 1 : 0);
                return `var steps = ${method}('${sequenceField.__id}', [${steps.join(', ')}]);\nsteps.onHit(function (time) {\n${statement}\n});\n`;
            },
        },
    }, {
        type: 'variable',
        name: 'bpm',
        setter: true,
        returnType: Number,
        default: 120,
    }, {
        type: 'function',
        name: 'start',
    }, {
        type: 'function',
        name: 'stop',
    }, {
        type: 'function',
        name: 'shuffle',
    }],
    onInstall(editor : Editor, part : SequencerPart) {
        if (editor.sourceType !== 'blockly') {
            return;
        }
        const blockType = `${part.id}_createSteps`;
        const sourceEditor = editor.sourceEditor as BlocklySourceEditor;
        const workspace = sourceEditor.getWorkspace();
        function updateSequence(field : FieldSequence) {
            const seq = part.sequencers.get(field.__id);
            if (!seq) {
                return;
            }
            seq.setSteps(field.getSteps());
        }
        // Watch every createSteps block creation
        onDidCreateBlockType(workspace, blockType, (e) => {
            // Block was created, watch the sequence field change and update the part accordingly
            const block = workspace.getBlockById(e.blockId)!;
            const field = block.getField('SEQUENCE') as FieldSequence;
            field.onDidChangeSteps(() => {
                console.log('haha');
                // sequence configuration changed, update the part
                updateSequence(field);
            });
            // Update the sequence initially
            updateSequence(field);
        });
        // On every step of the sequencer, update the position of the field
        part.onDidStep((e) => {
            const field = FieldSequence.map.get(e.id);
            field.setCurrentStep(e.column);
        });
        part.onDidStepsChange((e) => {
            const field = FieldSequence.map.get(e.id);
            field.setSteps(e.steps);
        });
    },
};