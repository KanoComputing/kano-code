import { IPartAPI } from '../../api.js';
import { SequencerPart } from './sequencer.js';
import { FieldSequence } from './blockly/field-sequence.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import Editor from '../../../editor/editor.js';
import { BlocklySourceEditor } from '../../../source-editor/blockly.js';
import { FieldSequenceConfig } from './blockly/field-sequence-config.js';
import { Meta } from '../../../meta-api/module.js';
import { onDidCreateBlockType } from '../../../util/blockly.js';
import { SequencerInlineDisplay } from './inline.js';
import { WebAudioTimestamp } from '../../../types.js';
import { svg } from '@kano/icons-rendering/index.js';

const icon = svg`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><title>Asset 4</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path d="M45,0H3A3,3,0,0,0,0,3V45a3,3,0,0,0,3,3H45a3,3,0,0,0,3-3V3A3,3,0,0,0,45,0ZM22.39,38.12a2.34,2.34,0,0,1-.71,1.7,2.28,2.28,0,0,1-1.71.7H10a2.39,2.39,0,0,1-2.42-2.4v-10a2.27,2.27,0,0,1,.7-1.7A2.23,2.23,0,0,1,10,25.69H20a2.23,2.23,0,0,1,1.71.69,2.36,2.36,0,0,1,.71,1.7Zm0-18.12A2.42,2.42,0,0,1,20,22.39H10a2.32,2.32,0,0,1-1.72-.71A2.24,2.24,0,0,1,7.54,20V10a2.24,2.24,0,0,1,.7-1.68A2.36,2.36,0,0,1,10,7.57H20a2.37,2.37,0,0,1,1.71.71A2.33,2.33,0,0,1,22.39,10ZM40.47,38.12a2.39,2.39,0,0,1-2.42,2.4H28a2.28,2.28,0,0,1-1.71-.7,2.34,2.34,0,0,1-.71-1.7v-10a2.36,2.36,0,0,1,.71-1.7A2.23,2.23,0,0,1,28,25.69h10a2.23,2.23,0,0,1,1.72.69,2.27,2.27,0,0,1,.7,1.7Zm0-18.12a2.24,2.24,0,0,1-.7,1.68,2.32,2.32,0,0,1-1.72.71H28A2.42,2.42,0,0,1,25.62,20V10a2.33,2.33,0,0,1,.71-1.68A2.37,2.37,0,0,1,28,7.57h10a2.36,2.36,0,0,1,1.72.71,2.24,2.24,0,0,1,.7,1.68Z"/></g></g></svg>`;

export const SequencerAPI : IPartAPI = {
    type: SequencerPart.type,
    label: 'Sequencer',
    color: '#ef5284',
    icon,
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