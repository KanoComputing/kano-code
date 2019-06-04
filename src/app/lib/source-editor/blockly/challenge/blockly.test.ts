import BlocklyChallenge from './blockly.js';
import Editor from '../../../editor/editor.js';
import * as sinon from 'sinon/pkg/sinon-esm.js';
import { assert } from '@kano/web-tester/helpers.js';
import { WorkspaceTester } from '../../../../../test/blockly/workspace.js';
import { Xml } from '@kano/kwc-blockly/blockly.js';

suite('BlocklyChallenge', () => {
    let ch : BlocklyChallenge;
    teardown(() => {
        if (ch) {
            ch.dispose();
        }
    });
    suite('_matchConnect()', () => {
        // Ensure the engine can match a block connecting to its parent through an input
        test('input', () => {
            const xmlString = `
                <xml>
                    <block type="test" id="test">
                        <value name="TEST">
                            <block type="target" id="target"></block>
                        </value>
                    </block>
                </xml>
            `;

            const workspaceTester = new WorkspaceTester();

            workspaceTester.addBlock('test', {
                init() {
                    this.appendValueInput('TEST');
                }
            });
            workspaceTester.addBlock('target', {
                init() {
                    this.setOutput(true);
                }
            });

            workspaceTester.setXml(xmlString);
    
            const editor = {
                sourceType: 'blockly',
                sourceEditor: {
                    getWorkspace() {
                        return workspaceTester.workspace;
                    },
                },
                querySelector() {}
            } as unknown as Editor;
            ch = new BlocklyChallenge(editor);
    
            const block = workspaceTester.workspace.getBlockById('target')!;
            const parent = workspaceTester.workspace.getBlockById('test')!.getInput('TEST')!;
    
            const validation = {
                target: 'block#target',
                parent: 'block#test>input#TEST',
            };
    
            sinon.stub(editor, 'querySelector')
                .withArgs(validation.target).returns({
                    getId() { return 'target' },
                    getHTMLElement() { return document.body; },
                    block,
                })
                .withArgs(validation.parent).returns({
                    getId() { return 'TEST' },
                    getHTMLElement() { return document.body; },
                    input: parent,
                });
    
            const result = ch._matchConnect(validation, {
                blockId: 'target',
            });
            assert(result);
            workspaceTester.dispose();
        });
        // Ensure the engine can match a block connecting to its parent through an input
        test('connection', () => {
            const xmlString = `
                <xml>
                    <block type="test" id="test">
                        <next>
                            <block type="target" id="target"></block>
                        </next>
                    </block>
                </xml>
            `;

            const workspaceTester = new WorkspaceTester();

            workspaceTester.addBlock('test', {
                init() {
                    this.setNextStatement(true);
                }
            });
            workspaceTester.addBlock('target', {
                init() {
                    this.setPreviousStatement(true);
                }
            });

            workspaceTester.setXml(xmlString);
            const editor = {
                sourceType: 'blockly',
                sourceEditor: {
                    getWorkspace() {
                        return workspaceTester.workspace;
                    },
                },
                querySelector() {}
            } as unknown as Editor;
            ch = new BlocklyChallenge(editor);
    
            const block = workspaceTester.workspace.getBlockById('target')!;
            const parent = workspaceTester.workspace.getBlockById('test')!.nextConnection!;
    
            const validation = {
                target: 'block#target',
                parent: 'block#test>next',
            };
    
            sinon.stub(editor, 'querySelector')
                .withArgs(validation.target).returns({
                    getId() { return 'target' },
                    getHTMLElement() { return document.body; },
                    block,
                })
                .withArgs(validation.parent).returns({
                    getId() { return 'next' },
                    getHTMLElement() { return document.body; },
                    connection: parent,
                });
    
            const result = ch._matchConnect(validation, {
                blockId: 'target',
            });
            assert(result);
            workspaceTester.dispose();
        });
        // Ensure a nested structure of shadow blocks doe snot prevent the engine to detect a connection
        test('nested shadow', () => {
            const xmlString = `
                <xml>
                    <block type="test" id="test">
                        <value name="TEST">
                            <shadow type="test_shadow">
                                <value name="SHADOW">
                                    <shadow type="test_shadow_2" id="target"></shadow>
                                </value>
                            </shadow>
                        </value>
                    </block>
                </xml>
            `;

            const workspaceTester = new WorkspaceTester();

            workspaceTester.addBlock('test', {
                init() {
                    this.appendStatementInput('TEST');
                }
            });
            workspaceTester.addBlock('test_shadow', {
                init() {
                    this.appendValueInput('SHADOW');
                    this.setPreviousStatement(true);
                }
            });
            workspaceTester.addBlock('test_shadow_2', {
                init() {
                    this.setOutput(true);
                }
            });
    
            workspaceTester.setXml(xmlString);
            const editor = {
                sourceType: 'blockly',
                sourceEditor: {
                    getWorkspace() {
                        return workspaceTester.workspace;
                    },
                },
                querySelector() {}
            } as unknown as Editor;
            ch = new BlocklyChallenge(editor);
    
            const block = workspaceTester.workspace.getBlockById('target')!;
            const parent = workspaceTester.workspace.getBlockById('test')!.getInput('TEST')!;
    
            const validation = {
                target: 'block#target',
                parent: 'block#test>input#TEST',
            };
    
            sinon.stub(editor, 'querySelector')
                .withArgs(validation.target).returns({
                    getId() { return 'target' },
                    getHTMLElement() { return document.body; },
                    block,
                })
                .withArgs(validation.parent).returns({
                    getId() { return 'TEST' },
                    getHTMLElement() { return document.body; },
                    input: parent,
                });
    
            const result = ch._matchConnect(validation, {
                blockId: 'target',
            });
            assert(result);
            workspaceTester.dispose();
        });
    });
    suite('_matchCreate()', () => {
        test('matches', () => {
            const workspaceTester = new WorkspaceTester();
            workspaceTester.addBlock('test', {});
            workspaceTester.setXml(`<xml><block type="test" id="test"></test></xml>`);
            const editor = {
                sourceType: 'blockly',
                sourceEditor: {
                    getWorkspace() {
                        return workspaceTester.workspace;
                    },
                },
                querySelector() {}
            } as unknown as Editor;
    
            ch = new BlocklyChallenge(editor);
    
            sinon.stub(editor, 'querySelector').returns({
                getId() { return 'test'; },
                getHTMLElement() { return document.body; },
                block: {
                    type: 'test',
                },
            });
    
            const validation = {
                type: 'block.test',
            };
    
            const xml = Xml.blockToDom(workspaceTester.workspace.getBlockById('test')!);
    
            const result = ch._matchCreate(validation, { xml });
            assert(result);
            workspaceTester.dispose();
        });
        test('does not match', () => {
            const workspaceTester = new WorkspaceTester();
            workspaceTester.addBlock('incorrect', {});
            workspaceTester.setXml(`<xml><block type="incorrect" id="test"></test></xml>`);
            const editor = {
                sourceType: 'blockly',
                sourceEditor: {
                    getWorkspace() {
                        return workspaceTester.workspace;
                    },
                },
                querySelector() {}
            } as unknown as Editor;
    
            ch = new BlocklyChallenge(editor);
    
            sinon.stub(editor, 'querySelector').returns({
                getId() { return 'test'; },
                getHTMLElement() { return document.body; }
            });
    
            const validation = {
                type: 'block.test',
            };
    
            const xml = Xml.blockToDom(workspaceTester.workspace.getBlockById('test')!);
    
            const result = ch._matchCreate(validation, { xml });
            assert(!result);
            workspaceTester.dispose();
        });
    });
});
