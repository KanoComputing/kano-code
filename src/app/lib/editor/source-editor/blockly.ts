import { EventEmitter, subscribeDOM } from '@kano/common/index.js';
import { SourceEditor } from './source-editor.js';
import '../../../elements/kc-blockly-editor/kc-blockly-editor.js';
import { Workspace, Block, Input, utils, Connection, Field } from '@kano/kwc-blockly/blockly.js';
import Editor from '../editor.js';
import { QueryEngine, ISelector, IQueryResult } from '../selector/selector.js';
import { memoize } from '../../util/decorators.js';

// Exclude those characters. This will allow the editor's quirying system to query block ids
utils.genUid.soup_ = utils.genUid.soup_.replace(/#|>|\.|:/g, '');

export class BlocklySourceEditor implements SourceEditor {
    private editor : Editor;
    private _onDidCodeChange : EventEmitter<string> = new EventEmitter<string>();
    private _onDidSourceChange : EventEmitter<any> = new EventEmitter<any>();
    public domNode : HTMLElement = document.createElement('kc-blockly-editor');
    constructor(editor : Editor) {
        this.editor = editor;
        (this.domNode as any).media = this.editor.config.BLOCKLY_MEDIA || '/node_modules/@kano/kwc-blockly/blockly_built/media/';
        subscribeDOM(this.domNode, 'code-changed', (e : any) => {
            this._onDidCodeChange.fire(e.detail.value);
        });
        subscribeDOM(this.domNode, 'action', (e : any) => {
            this._onDidSourceChange.fire(e.detail);
        });
    }
    get onDidCodeChange() {
        return this._onDidCodeChange.event;
    }
    get onDidSourceChange() {
        return this._onDidSourceChange.event;
    }
    setToolbox(toolbox : any) : void {
        (this.domNode as any).defaultCategories = toolbox;
    }
    setSource(source : string) : void {
        (this.domNode as any).blocks = source;
    }
    getSource() {
        return (this.domNode as any).getSource();
    }
    @memoize
    getWorkspace() : Workspace {
        return (this.domNode as any).getBlocklyWorkspace();
    }
    registerQueryHandlers(engine: QueryEngine) {
        engine.registerTagHandler('block', (selector : ISelector, parent) => {
            if (selector.id) {
                const workspace = this.getWorkspace();
                const id = selector.id;
                const block = workspace.getBlockById(id);
                if (!block) {
                    return null;
                    // throw new Error(`Could not find block with id '${id}'`);
                }
                return {
                    block,
                    getId() { return block.id; },
                    getBlock() { return block; },
                    getHTMLElement() {
                        return block.getSvgRoot();
                    },
                };
            } else if (selector.class) {
                let scope = '';
                if (parent) {
                    scope = `${parent.getId()}_`;
                }
                const workspace = this.getWorkspace();
                const allBlocks = workspace.getAllBlocks();
                const type = `${scope}${selector.class}`;
                const block = allBlocks.find(b => b.type === type);
                if (!block) {
                    return null;
                    // throw new Error(`Could not find block with type '${type}'`);
                }
                return {
                    block,
                    getId() { return block.id },
                    getBlock() { return block; },
                    getHTMLElement() {
                        return block.getSvgRoot();
                    },
                };
            }
            return null;
            // throw new Error('Could not query block. Neither id nor class is defined');
        });
        engine.registerTagHandler('toolbox', (selector : ISelector, parent : IQueryResult|null) => {
            let id : string;
            if (parent && typeof parent.getToolboxId === 'function') {
                id = parent.getToolboxId();
            } else if (selector.id) {
                id = selector.id;
            } else {
                return null;
                // throw new Error('Could not query toolbox. Neither id nor class is defined');
            }
            const toolbox = (this.domNode as any).defaultCategories as any[];
            const entry = toolbox.find(e => e.id === id);
            if (!entry) {
                return null;
                // throw new Error(`Could not find toolbox entry with id '${id}'`);
            }
            const workspace = this.getWorkspace();
            return {
                entry,
                getId() { return entry.id; },
                getToolboxId() { return entry.id },
                getHTMLElement() {
                    return workspace.toolbox.getCategoryElement(this.entry.id);
                },
            };
        });
        engine.registerTagHandler('flyout-block', (selector : ISelector, parent : IQueryResult|null) => {
            let scope : string = '';
            if (!parent) {
                if (selector.class) {
                    const workspace = this.getWorkspace();
                    const flyout = workspace.toolbox.flyout_;
                    if (!flyout) {
                        return null;
                        // throw new Error('Could not find block in flyout: No flyout is opened');
                    }
                    const block = flyout.getBlockByType(selector.class);
                    if (!block) {
                        return null;
                        // throw new Error(`Could not find block ${selector.class}`);
                    }
                    return {
                        block,
                        getId() { return selector.class; },
                        getHTMLElement() {
                            return block.getSvgRoot();
                        },
                    };
                }
                return null;
            } else {
                if (typeof parent.getToolboxId === 'function') {
                    scope = parent.getToolboxId();
                }
                if (selector.id) {
                    const workspace = this.getWorkspace();
                    const flyout = workspace.toolbox.flyout_;
                    if (!flyout) {
                        return null;
                        // throw new Error('Could not find block in flyout: No flyout is opened');
                    }
                    const block = flyout.getBlockByType(`${scope}_${selector.id}`);
                    if (!block) {
                        return null;
                        // throw new Error(`Could not find block ${selector.id}`);
                    }
                    return {
                        block,
                        getId() { return `${scope}_${selector.id}`; },
                        getHTMLElement() {
                            return block.getSvgRoot();
                        },
                    };
                } else if (selector.class) {
                    const workspace = this.getWorkspace();
                    const flyout = workspace.toolbox.flyout_;
                    if (!flyout) {
                        return null;
                        // throw new Error('Could not find block in flyout: No flyout is opened');
                    }
                    const block = flyout.getBlockByType(`${scope}_${selector.class}`);
                    if (!block) {
                        return null;
                        // throw new Error(`Could not find block ${selector.class}`);
                    }
                    return {
                        block,
                        getId() { return `${scope}_${selector.class}`; },
                        getHTMLElement() {
                            return block.getSvgRoot();
                        },
                    };
                }
                return null;
            }
        });
        // input means input and fields
        engine.registerTagHandler('input', (selector : ISelector, parent : IQueryResult|null) => {
            if (!parent || typeof parent.getBlock !== 'function') {
                return null;
                // throw new Error('Could not query input: Parent selector is not a block');
            }
            const block = parent.getBlock() as Block;
            const id = selector.id || selector.class;
            let input : Input|null = null;
            let field : Field|null = null;
            if (!id) {
                input = block.inputList[0];
            } else {
                input = block.getInput(id.toUpperCase());
                if (!input) {
                    field = block.getField(id.toUpperCase());
                }
            }
            if (!input && !field) {
                return null;
                // throw new Error(`Could not find input or field named '${id}'`);
            }
            return {
                input,
                field,
                getId() { return block.id },
                getInput() { return input; },
                getField() { return field; },
                getPosition: () => {
                    const rect = this.getInputPosition(block, id ? id.toUpperCase() : undefined);
                    return { x: rect.left, y: rect.top };
                },
                getHTMLElement() {
                    return input!.sourceBlock_.getSvgRoot();
                },
            };
        });
        engine.registerTagHandler('next', (selector : ISelector, parent : IQueryResult|null) => {
            if (!parent || typeof parent.getBlock !== 'function') {
                return null;
                // throw new Error('Could not query input: Parent selector is not a block');
            }
            const block = parent.getBlock() as Block;
            let connection : Connection|undefined = block.nextConnection;
            if (!connection) {
                return null;
            }
            return {
                connection,
                getId() { return block.id },
                getConnection() { return connection },
                getPosition: () => {
                    const rect = this.getInputPosition(block);
                    return { x: rect.left, y: rect.top };
                },
                getHTMLElement() {
                    return block.getSvgRoot();
                },
            };
        });
    }
    getInputPosition(block : Block, name? : string) {
        let connection,
            blockRect,
            blockPos,
            inputRelPos;

        if (!name) {
            connection = block.nextConnection;
        } else {
            // For positioning, assume input === field
            const field = block.getField(name);
            if (field && field.fieldGroup_) {
                return field.fieldGroup_.getBoundingClientRect();
            } else {
                const input = block.getInput(name);
                if (!input) {
                    return block.getSvgRoot().getBoundingClientRect();
                }
                connection = input.connection;
            }
        }

        if (!connection) {
            return block.getSvgRoot().getBoundingClientRect();
        }
        blockRect = block.svgPath_.getBoundingClientRect();
        blockPos = block.getRelativeToSurfaceXY();
        inputRelPos = {
            x: connection.x_ - blockPos.x,
            y: connection.y_ - blockPos.y,
        };

        return {
            left: blockRect.left + inputRelPos.x,
            top: blockRect.top + inputRelPos.y,
            right: blockRect.right + blockRect.width - inputRelPos.x,
            bottom: blockRect.bottom + blockRect.height - inputRelPos.y,
            width: 1,
            height: 1,
        } as DOMRect;
    }
    getBlockByType(workspace : Workspace, type : string) {
        const allBlocks = workspace.getAllBlocks();
        return allBlocks.find(b => b.type === type);
    }
}
