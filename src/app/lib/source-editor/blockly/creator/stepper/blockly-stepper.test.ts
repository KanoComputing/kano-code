import { Editor } from '../../../../editor/editor.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import './index.js';
import { WorkspaceTester } from '../../../../../../test/blockly/workspace.js';
import { BlocklyStepper } from './blockly-stepper.js';
import { Challenge } from '../../../../challenge/index.js';

suite('BlocklyStepper', () => {
    test('lol', () => {
        const workspaceTester = new WorkspaceTester();
        workspaceTester.addBlock('test', {
            init() {
                this.setNextStatement(true);
            }
        });
        workspaceTester.addBlock('test2', {
            init() {
                this.setPreviousStatement(true);
            }
        });
        const editor = {
            sourceEditor: {
                getWorkspace() {
                    return workspaceTester.workspace;
                }
            },
            sourceType: 'blockly',
            parts: {
                onDidOpenAddParts() {},
                onDidAddPart() {}
            },
            domNode: { shadowRoot: document.createElement('div') },
            querySelector() {},
        } as unknown as Editor;
        sinon.stub(editor, 'querySelector')
            .withArgs('toolbox.app>flyout-block.app_onStart')
            .returns({
                getId() { return 'test'; },
                getHTMLElement() { return document.createElement('div'); }
            })
            .withArgs('toolbox.math>flyout-block.math_arithmetic')
            .returns({
                getId() { return 'test2'; },
                getHTMLElement() { return document.createElement('div'); }
            })
            .withArgs('alias#block_0')
            .returns({
                getId() { return 'test'; },
                getHTMLElement() { return document.createElement('div'); }
            });
        const challenge = {
            data: {
                steps: [{
                    type: 'create-block',
                    "category": "toolbox.app",
                    "blockType": "app_onStart",
                    "alias": "block_0",
                    "openFlyoutCopy": "Open the App tray",
                    "grabBlockCopy": "Pick up the block with your mouse or finger and drag it into the middle",
                    "dropCopy": "Drop it onto your code space to add it into your program."
                }, {
                    type: 'create-block',
                    "category": "toolbox.math",
                    "blockType": "math_arithmetic",
                    "alias": "block_1",
                    "openFlyoutCopy": "Open the App tray",
                    "grabBlockCopy": "Pick up the block with your mouse or finger and drag it into the middle",
                    "connectCopy": "Drop it onto your code space to add it into your program.",
                    connectTo: 'alias#block_0>next',
                }],
            },
        } as Challenge;
        const stepper = new BlocklyStepper(editor, challenge);
        stepper.stepTo(2);
    });
});
