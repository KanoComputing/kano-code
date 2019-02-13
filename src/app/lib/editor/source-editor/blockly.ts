import { EventEmitter, subscribeDOM } from '@kano/common/index.js';
import { SourceEditor } from './source-editor.js';
import '../../../elements/kc-blockly-editor/kc-blockly-editor.js';
import { Workspace, Block, Input } from '@kano/kwc-blockly/blockly.js';
import Editor from '../editor.js';
import { QueryEngine, ISelector, IQueryResult } from '../selector/selector.js';
import { memoize } from '../../util/decorators.js';

export class BlocklySourceEditor implements SourceEditor {
    private editor : Editor;
    private _onDidCodeChange : EventEmitter<string> = new EventEmitter<string>();
    public domNode : HTMLElement = document.createElement('kc-blockly-editor');
    constructor(editor : Editor) {
        this.editor = editor;
        (this.domNode as any).media = this.editor.config.BLOCKLY_MEDIA || '/node_modules/@kano/kwc-blockly/blockly_built/media/';
        subscribeDOM(this.domNode, 'code-changed', (e : any) => {
            this._onDidCodeChange.fire(e.detail.value);
        });
    }
    get onDidCodeChange() {
        return this._onDidCodeChange.event;
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
        engine.registerTagHandler('default-block', (selector : ISelector) => {
            if (selector.id) {
                const workspace = this.getWorkspace();
                const block = workspace.getBlockById(selector.id);
                if (!block) {
                    throw new Error(`Could not find block with id '${selector.id}'`);
                }
                return {
                    block,
                    getBlock() { return block; },
                    getHTMLElement() {
                        return block.getSvgRoot();
                    },
                };
            } else if (selector.class) {
                const workspace = this.getWorkspace();
                const allBlocks = workspace.getAllBlocks();
                const block = allBlocks.find(b => b.type === selector.class);
                if (!block) {
                    throw new Error(`Could not find block with type '${selector.class}'`);
                }
                return {
                    block,
                    getBlock() { return block; },
                    getHTMLElement() {
                        return block.getSvgRoot();
                    },
                };
            }
            throw new Error('Could not query block. Neither id nor class is defined');
        });
        engine.registerTagHandler('toolbox', (selector : ISelector, parent? : IQueryResult) => {
            let id : string;
            if (parent && typeof parent.getToolboxId === 'function') {
                id = parent.getToolboxId();
            } else if (selector.id) {
                id = selector.id;
            } else {
                throw new Error('Could not query toolbox. Neither id nor class is defined');
            }
            const toolbox = (this.domNode as any).defaultCategories as any[];
            const entry = toolbox.find(e => e.id === id);
            if (!entry) {
                throw new Error(`Could not find toolbox entry with id '${id}'`);
            }
            const workspace = this.getWorkspace();
            return {
                entry,
                getToolboxId() { return entry.id },
                getHTMLElement() {
                    return workspace.toolbox.getCategoryElement(this.entry.id);
                },
            };
        });
        engine.registerTagHandler('block', (selector : ISelector, parent? : IQueryResult) => {
            let scope : string = '';
            if (!parent) {
                // Handle aliases
                throw new Error('Not implemented');
            } else {
                if (typeof parent.getToolboxId === 'function') {
                    scope = parent.getToolboxId();
                }
                if (selector.id) {
                    const workspace = this.getWorkspace();
                    const flyout = workspace.toolbox.flyout_;
                    if (!flyout) {
                        throw new Error('Could not find block in flyout: No flyout is opened');
                    }
                    const block = flyout.getBlockByType(`${scope}_${selector.id}`);
                    if (!block) {
                        throw new Error(`Could not find block ${selector.id}`);
                    }
                    return {
                        block,
                        getHTMLElement() {
                            return block.getSvgRoot();
                        },
                    };
                } else if (selector.class) {
                    const workspace = this.getWorkspace();
                    const block = this.getBlockByType(workspace, selector.class);
                    if (!block) {
                        throw new Error(`Could not find block with type '${selector.class}'`);
                    }
                    return {
                        block,
                        getBlock() { return block; },
                        getHTMLElement() {
                            return block.getSvgRoot();
                        },
                    };
                }
                throw new Error('Could not query toolbox. Neither id nor class is defined');
            }
        });
        engine.registerTagHandler('input', (selector : ISelector, parent? : IQueryResult) => {
            if (!parent || typeof parent.getBlock !== 'function') {
                throw new Error('Could not query input: Parent selector is not a block');
            }
            const block = parent.getBlock() as Block;
            const id = selector.id || selector.class;
            let input : Input|null;
            if (!id) {
                input = block.inputList[0];
            } else {
                input = block.getInput(id.toUpperCase());
            }
            if (!input) {
                throw new Error('Could not find input');
            }
            return {
                input,
                getInput() { return input },
                // TODO: This can't get the input location. enhacne the query api to return DOMElement AND rect relative to the element
                getHTMLElement() {
                    return input!.sourceBlock_.getSvgRoot();
                },
            };
        });
    }

    getBlockByType(workspace : Workspace, type : string) {
        const allBlocks = workspace.getAllBlocks();
        return allBlocks.find(b => b.type === type);
    }
}
