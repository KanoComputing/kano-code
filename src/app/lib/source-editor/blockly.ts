import { EventEmitter, subscribeDOM, IDisposable } from '@kano/common/index.js';
import { SourceEditor } from './source-editor.js';
import '../../elements/kc-blockly-editor/kc-blockly-editor.js';
import { Workspace, Block, Input, utils, Connection, Field } from '@kano/kwc-blockly/blockly.js';
import Editor from '../editor/editor.js';
import { QueryEngine, ISelector, IQueryResult } from '../editor/selector/selector.js';
import { memoize } from '../util/decorators.js';
import '../blockly/core/xml.js';
import BlocklyMetaRenderer from './blockly/api-renderer.js';
import { debounce } from '../decorators.js';
import { Highlighter } from '../creator/ui/highlighter.js';

// Exclude those characters. This will allow the editor's querying system to query block ids
utils.genUid.soup_ = utils.genUid.soup_.replace(/#|>|\.|:/g, '');

export class BlocklySourceEditor implements SourceEditor {
    public editor : Editor;
    private _onDidCodeChange : EventEmitter<string> = new EventEmitter<string>();
    private _onDidSourceChange : EventEmitter<any> = new EventEmitter<any>();
    private _onDidLayout : EventEmitter = new EventEmitter();
    public domNode : HTMLElement = document.createElement('kc-blockly-editor');
    private apiRenderer? : BlocklyMetaRenderer;
    constructor(editor : Editor) {
        this.editor = editor;
        (this.domNode as any).media = this.editor.config.BLOCKLY_MEDIA || '/node_modules/@kano/kwc-blockly/blockly_built/media/';
        subscribeDOM(this.domNode, 'code-changed', (e : any) => {
            this._onDidCodeChange.fire(e.detail.value);
        });
        subscribeDOM(this.domNode, 'action', (e : any) => {
            this._onDidSourceChange.fire(e.detail);
        });
        this.editor.onDidInject(() => {
            const workspace = (this.domNode as any).getBlocklyWorkspace() as Workspace;
            workspace.addChangeListener((e) => {
                // Be greedy for now. TODO: tweak this to ignore non relevent events
                if (e.type === 'open-flyout' || e.type === 'close-flyout') {
                    // These events are triggered before the dom layout changes, this trick makes the layout event triggered sync with the actual DOM change
                    setTimeout(() => this.triggerLayout());
                } else {
                    this.triggerLayout();
                }
            });
            const blocklyEl = (this.domNode as any).$['code-editor'];
            const toolbox = blocklyEl.getToolbox();
            subscribeDOM(toolbox, 'scroll', () => this.triggerLayout());
        });
        this.editor.exposeMethod('logBlock', () => this.logBlockUnderCursor());
    }
    @debounce(10)
    triggerLayout() {
        this._onDidLayout.fire();
    }
    get onDidCodeChange() {
        return this._onDidCodeChange.event;
    }
    get onDidLayout() {
        return this._onDidLayout.event;
    }
    get onDidSourceChange() {
        return this._onDidSourceChange.event;
    }
    setToolbox(toolbox : any) {
        (this.domNode as any).defaultCategories = toolbox;
    }
    setSource(source : string) {
        (this.domNode as any).blocks = source;
        (this.domNode as any).loadBlocks(source);
    }
    setFlyoutMode(flyoutMode: boolean) {
        (this.domNode as any).flyoutMode = flyoutMode;
        this.triggerLayout();
    }
    setInputDisabled(isInputDisabled: boolean) {
        (this.domNode as any).inputDisabled = isInputDisabled;
    }
    getSource() {
        return (this.domNode as any).getSource();
    }
    @memoize
    getWorkspace() : Workspace {
        return (this.domNode as any).getBlocklyWorkspace();
    }
    findBlockForSvgElement(el : HTMLElement) {
        function step(el : HTMLElement|null) : HTMLElement|null {
            if (!el) {
                return null;
            }
            if (el.tagName.toLowerCase() === 'svg') {
                return null;
            }
            if (!el.classList.contains('blocklyDraggable')) {
                return step(el.parentElement);
            }
            return el;
        }
        const rootEl = step(el);
        if (!rootEl) {
            return null;
        }
        const { id } = rootEl.dataset;
        if (!id) {
            return null;
        }
        const workspace = this.getWorkspace();
        return workspace.getBlockById(id);
    }
    findFieldForSvgElementAndBlock(el : HTMLElement, block : Block) {
        function step(el : HTMLElement) : HTMLElement|null {
            if (el.tagName.toLowerCase() === 'svg') {
                return null;
            }
            if (el.tagName.toLowerCase() === 'g' && el.classList.contains('blocklyEditableText')) {
                return el;
            }
            if (!el.parentElement) {
                return null;
            }
            return step(el.parentElement);
        }
        const group = step(el);
        for (let i = 0; i < block.inputList.length; i += 1) {
            const input = block.inputList[i];
            for (let j = 0; j < input.fieldRow.length; j += 1) {
                const field = input.fieldRow[j];
                if (field.fieldGroup_ === group) {
                    return field;
                };
            }
        }
    }
    elementFromPoint(x : number, y : number) {
        const blocklyEl = (this.domNode as any).$['code-editor'];
        return blocklyEl.shadowRoot.elementFromPoint(x, y);
    }
    blockFromPoint(x : number, y : number) {
        const el = this.elementFromPoint(x, y);
        return this.findBlockForSvgElement(el);
    }
    logBlockUnderCursor() {
        let selectedTarget : string|undefined;
        let d : IDisposable;
        const highlighter = new Highlighter();
        const sub = subscribeDOM(this.editor.domNode, 'mousemove', (e : MouseEvent) => {
            highlighter.clear();
            if (d) {
                d.dispose();
            }
            const el = this.elementFromPoint(e.x, e.y);
            const block = this.findBlockForSvgElement(el);
            if (!block) {
                return;
            }
            const field = this.findFieldForSvgElementAndBlock(el, block);
            let selector = `block#${block.id}`;
            if (field) {
                selector += `>input#${field.name}`;
            }
            selectedTarget = selector;
            const target = this.editor.queryElement(selector);
            if (target) {
                highlighter.highlight(target);
            }
        });
        const workspace = this.getWorkspace();
        const cancelSub = subscribeDOM(document.body, 'click', () => {
            end();
        });
        const onClick = (e : any) => {
            if (e.element && e.element === 'click') {
                console.log(selectedTarget);
                end();
            }
        }
        function end() {
            sub.dispose();
            cancelSub.dispose();
            workspace.removeChangeListener(onClick);
            highlighter.clear();
        }
        workspace.addChangeListener(onClick);
    }
    getToolbox() : any[] {
        return (this.domNode as any).$['code-editor'].toolbox;
    }
    getToolboxById(id : string) {
        const toolbox = this.getToolbox();
        return toolbox.find(entry => entry.id === id);
    }
    getToolboxBlockByType(id : string, type : string) {
        const toolbox = this.getToolboxById(id);
        if (!toolbox) {
            return null;
        }
        return toolbox.blocks.find((block : any) => block.id === type);
    }
    registerQueryHandlers(engine: QueryEngine) {
        engine.registerTagHandler('block', (selector : ISelector, parent) => {
            if (selector.id) {
                const workspace = this.getWorkspace();
                const id = selector.id;
                const block = workspace.getBlockById(id);
                if (!block) {
                    engine.warn(`Could not find block with id '${id}'`);
                    return null;
                }
                return {
                    block,
                    getId() { return block.id; },
                    getBlock() { return block; },
                    getHTMLElement() {
                        return block.svgPath_;
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
                    engine.warn(`Could not find block with type '${type}'`);
                    return null;
                }
                return {
                    block,
                    getId() { return block.id },
                    getBlock() { return block; },
                    getHTMLElement() {
                        return block.svgPath_;
                    },
                };
            }
            engine.warn('Could not query block. Neither id nor class is defined');
            return null;
        });
        engine.registerTagHandler('shadow', (selector : ISelector, parent) => {
            if (!parent) {
                throw new Error('Could not query shadow block: Shadow block can only be queried when they have a parent');
            }
            let connection : Connection|undefined;
            if (typeof parent.getInput === 'function') {
                const input = parent.getInput() as Input|null;
                if (input) {
                    connection = input.connection;
                }
            }
            if (!connection && typeof parent.getConnection === 'function') {
                connection = parent.getConnection();
            }
            if (!connection) {
                throw new Error('Could not query shadow block: Parent selector does not resolve to a connection');
            }
            const { targetConnection } = connection;
            const block = targetConnection.getSourceBlock();
            return {
                block,
                getId() { return block.id; },
                getBlock() { return block; },
                getHTMLElement() {
                    return block.svgPath_;
                },
            };
        });
        engine.registerTagHandler('toolbox', (selector : ISelector, parent : IQueryResult|null) => {
            let id : string;
            if (parent && typeof parent.getToolboxId === 'function') {
                id = parent.getToolboxId();
            } else if (selector.id) {
                id = selector.id;
            } else {
                engine.warn('Could not query toolbox. Neither id nor class is defined');
                return null;
            }
            const toolbox = (this.domNode as any).defaultCategories as any[];
            const entry = toolbox.find(e => e.id === id);
            if (!entry) {
                engine.warn(`Could not find toolbox entry with id '${id}'`);
                return null;
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
                        engine.warn('Could not find block in flyout: No flyout is opened');
                        return null;
                    }
                    const block = flyout.getBlockByType(selector.class);
                    return {
                        block,
                        getId() { return selector.class; },
                        getHTMLElement() {
                            return block ? block.getSvgRoot() : flyout as unknown as HTMLElement;
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
                        engine.warn('Could not find block in flyout: No flyout is opened');
                        return null;
                    }
                    const block = flyout.getBlockByType(`${scope}_${selector.id}`);
                    return {
                        block,
                        getId() { return `${scope}_${selector.id}`; },
                        getHTMLElement() {
                            return block ? block.getSvgRoot() : flyout as unknown as HTMLElement;
                        },
                    };
                } else if (selector.class) {
                    const workspace = this.getWorkspace();
                    const flyout = workspace.getFlyout_();
                    if (!flyout) {
                        engine.warn('Could not find block in flyout: No flyout is opened');
                        return null;
                    }
                    let block = flyout.getBlockByType(`${scope}_${selector.class}`);
                    if (!block) {
                        block = flyout.getBlockByType(selector.class);
                    }
                    return {
                        block,
                        getId() { return selector.class; },
                        getHTMLElement() {
                            return block ? block.getSvgRoot() : flyout as unknown as HTMLElement;
                        },
                    };
                }
                return null;
            }
        });
        // input means input and fields
        engine.registerTagHandler('input', (selector : ISelector, parent : IQueryResult|null) => {
            if (!parent || typeof parent.getBlock !== 'function') {
                engine.warn('Could not query input: Parent selector is not a block');
                return null;
            }
            const block = parent.getBlock() as Block;
            const id = selector.id || selector.class;
            let input : Input|null = null;
            let field : Field|null = null;
            if (!id) {
                input = block.inputList[0];
            } else {
                // Fields are more specific than inputs, try to get the field first
                field = block.getField(id.toUpperCase());
                if (!field) {
                    input = block.getInput(id.toUpperCase());
                }
            }
            if (!input && !field) {
                engine.warn(`Could not find input or field named '${id}'`);
                return null;
            }
            return {
                input,
                field,
                getId() { return block.id },
                getInput() { return input; },
                getField() { return field; },
                getBlock() {
                    if (!input || !input.connection || !input.connection.targetConnection) {
                        return null;
                    }
                    return input.connection.targetConnection.getSourceBlock();
                },
                getPosition: () => {
                    const rect = this.getInputPosition(block, id ? id.toUpperCase() : undefined);
                    return { x: rect.left, y: rect.top };
                },
                getHTMLElement() {
                    if (field) {
                        return field.fieldGroup_;
                    }
                    return (input as any).sourceBlock_.getSvgRoot();
                },
            };
        });
        engine.registerTagHandler('next', (selector : ISelector, parent : IQueryResult|null) => {
            if (!parent || typeof parent.getBlock !== 'function') {
                engine.warn('Could not query input: Parent selector is not a block');
                return null;
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
    getApiRenderer() {
        if (!this.apiRenderer) {
            this.apiRenderer = new BlocklyMetaRenderer();
        }
        return this.apiRenderer;
    }
}
