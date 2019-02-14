import Challenge from 'challenge-engine/definition.js';
import { Workspace, Block, Blockly } from '@kano/kwc-blockly/blockly.js';
import { Editor } from '../editor/editor.js';
import { BlocklySourceEditor } from '../editor/source-editor/blockly.js';
import { IQueryResult } from '../editor/selector/selector.js';

class BlocklyChallenge extends Challenge {
    protected editor : Editor;
    protected workspace : Workspace;
    protected eventsMap : { [K : string] : string };
    public aliases : Map<string, string> = new Map();
    constructor(editor : Editor) {
        super();
        this.editor = editor;
        if (this.editor.sourceType !== 'blockly') {
            throw new Error('Cannot use a blockly challenge with non-blockly editor');
        }
        this.workspace = (editor.sourceEditor as BlocklySourceEditor).getWorkspace();
        this.eventsMap = {
            move: 'connect',
            change: 'value',
            'drop-block': 'drop',
        };
        this.addValidation('blockly', this._validate);
        this.addValidation('create', this._matchCreate);
        this.addValidation('connect', this._matchConnect);
        this.addValidation('value', this._matchBlocklyValue);
        this.addValidation('delete', this._matchDelete);
        this.addValidation('open-flyout', this._matchCategory);
        this.addValidation('close-flyout', this._matchCategory);
        this.addValidation('drop', this._matchDrop);

        this.addOppositeAction('create', 'close-flyout', this._flyoutClosed.bind(this));
        this.addOppositeAction('create', 'open-flyout', this._flyoutClosed.bind(this));
        this.addOppositeAction('open-flyout', 'create', this._wrongCategory.bind(this));
        this.addOppositeAction('open-flyout', 'close-flyout', this._wrongCategory.bind(this));
        this.addOppositeAction('connect', 'delete', this._deleteNotExpected.bind(this));

        this.addMatchFallback('open-flyout', this._wrongCategory.bind(this));
        this.addMatchFallback('close-flyout', this._wrongCategory.bind(this));
        this.addMatchFallback('create', this._flyoutClosed.bind(this));

        this.defineShorthand('create-block', this._createBlockShorthand.bind(this));
        this.defineShorthand('change-input', this._changeInputShorthand.bind(this));

        this.defineBehavior('phantom_block', this._onPhantomBlockEnter.bind(this), this._onPhantomBlockLeave);

        this.createStore('blocks');
    }
    _updateStep() {
        super._updateStep();
        Blockly.WidgetDiv.hide();
    }
    _processBlock(block : any) {
        if (block.id) {
            block.id = this.getFromStore('blocks', block.id);
        } else if (block.rawId) {
            block.id = block.rawId;
        }
        return block;
    }
    _wrongCategory() {
        this._updateStep();
    }
    _deleteNotExpected(validation : any, detail : any) {
        // Ignore delete events from shadow blocks
        if (detail.oldXml.tagName.toLowerCase() === 'shadow') {
            return;
        }
        this.stepIndex -= 2;
    }
    _flyoutClosed() {
        this.stepIndex -= 1;
    }
    _onPhantomBlockEnter(phantom_block : any) {
        let connection,
            target,
            host;

        if (!phantom_block ||
            !phantom_block.location ||
            !Blockly.selected) {
            return;
        }
        host = this.getTargetBlock(phantom_block.location.block);

        if (!host) {
            return;
        }

        if (phantom_block.target === '@previous') {
            connection = host.previousConnection;
        } else if (phantom_block.target === '@next') {
            connection = host.nextConnection;
        } else if (phantom_block.target) {
            for (let i = 0; i < host.inputList.length; i++) {
                if (host.inputList[i].name === phantom_block.target) {
                    connection = host.inputList[i].connection;
                    break;
                }
            }
        } else {
            connection = host.nextConnection;
        }
        target = Blockly.selected;

        if (!connection) {
            return;
        }
        Blockly.setPhantomBlock(connection, target);
    }
    _onPhantomBlockLeave() {
        Blockly.removePhantomBlock();
    }
    _getOpenFlyoutStep(data : any) {
        return {
            validation: {
                blockly: {
                    'open-flyout': data.category,
                },
            },
        };
    }
    _getCloseFlyoutStep(data : any) {
        return {
            validation: {
                blockly: {
                    'close-flyout': data.category,
                },
            },
        };
    }
    _getCreateBlockStep(data : any) {
        return {
            validation: {
                blockly: {
                    create: {
                        type: data.blockType,
                        id: data.alias,
                    },
                },
            },
        };
    }
    _getConnectBlockStep(data : any) {
        return {
            validation: {
                blockly: {
                    connect: {
                        parent: data.connectTo,
                        target: data.alias,
                    },
                },
            },
            phantom_block: {
                location: {
                    block: data.connectTo,
                },
                target: data.connectTo.inputName,
            },
        };
    }
    _getDropBlockStep(data : any) {
        return {
            validation: {
                blockly: {
                    drop: {
                        target: data.alias,
                    },
                },
            },
        };
    }
    _createBlockShorthand(data : any) {
        const openFlyoutStep = this._getOpenFlyoutStep(data);
        const createStep = this._getCreateBlockStep(data);
        const steps : any[] = [createStep];
        if (this.workspace.toolbox_) {
            steps.unshift(openFlyoutStep);
        }
        if (data.connectTo) {
            steps.push(this._getConnectBlockStep(data));
        } else {
            steps.push(this._getDropBlockStep(data));
        }
        return steps;
    }
    _changeInputShorthand(data : any) {
        return {
            validation: {
                blockly: {
                    value: {
                        target: data.block,
                        value: data.value,
                    },
                },
            },
        };
    }
    getBlockType(validation : any) {
        let target = validation.type && validation.type.part ? this.getFromStore('parts', validation.type.part) : validation.rawTarget,
            type;
        // Use the type or the value directly
        // Allows to declare shorthand creation as:
        // create: 'text'
        // or
        // create: {
        //     type: 'text'
        // }

        type = this.getTypeString(validation);
        type = target ? `${target}#${type}` : type;
        return type;
    }
    getTypeString(validation : any) : string {
        if (typeof validation === 'string') {
            return validation;
        }
        return this.getTypeString(validation.type);
    }
    getTargetBlock(selector : any) {
        let block;
        if (typeof selector === 'string') {
            block = this.workspace.getBlockById(this.getFromStore('blocks', selector));
        } else if (selector.id) {
            block = this.workspace.getBlockById(this.getFromStore('blocks', selector.id));
        } else if (selector.rawId) {
            block = this.workspace.getBlockById(selector.rawId);
        }
        if (selector.shadow && block) {
            block = this.getTargetBlockShadow(block, selector.shadow);
        }
        return block;
    }
    getTargetBlockShadow(block : Block, selector : any) : Block|null {
        if (typeof selector === 'string') {
            const input = block.getInput(selector);
            if (!input || !input.connection) {
                return null;
            }
            return input.connection.targetBlock();
        } else if ('shadow' in selector && 'name' in selector) {
            const input = block.getInput(selector.name);
            if (!input || !input.connection) {
                return null;
            }
            return this.getTargetBlockShadow(input.connection.targetBlock(), selector.shadow);
        }
        return null;
    }
    _matchCategory(validation : string, event : any) {
        const result = this.editor.querySelector(validation);
        const id = result.getId();
        return event.categoryId === id;
    }
    _matchBlockType(type : string, event : any) {
        return event.xml.getAttribute('type') === type;
    }
    _matchDelete(validation : any, event : any) {
        let target = validation.target || validation,
            blockId;
        if (typeof target === 'string') {
            blockId = this.getFromStore('blocks', target);
        } else if (target.id) {
            blockId = this.getFromStore('blocks', target.id);
        } else if (target.rawId) {
            blockId = target.rawId;
        }
        if (blockId !== event.blockId) {
            return false;
        }
        delete this._stores.blocks[target];
        return true;
    }
    _matchCreate(validation : any, event : any) {
        const result = this.editor.querySelector(validation.type);
        const type = result.getId();
        // Check the type of the added block
        if (this._matchBlockType(type, event)) {
            // The new block created is added to the step, using its
            // step id for further reference
            if (validation.alias) {
                this.aliases.set(validation.alias, `block#${event.blockId}`);
            }
            return true;
        }
        return false;
    }
    _matchConnect(validation : any, event : any) {
        // Extract the validation object, target and parent step ids and
        // the block moved
        const target = this.editor.querySelector(validation.target).block as Block;
        const parent = this.editor.querySelector(validation.parent).block as Block;

        // Check that the element moved is the one targeted and that its
        // new parent is the right one
        if (target && parent && event.blockId === target.id && event.newParentId === parent.id) {
            let connection;

            if (!validation.connection) {
                return true;
            }

            const input = parent.getInput(validation.connection);
            if (input) {
                connection = input.connection;
            } else {
                return false;
            }

            if (!connection) {
                return false;
            }

            connection = connection.targetConnection;
            return (connection.getSourceBlock().id === target.id);
        }
        return false;
    }
    _matchDrop(validation : any, event : any) {
        const _block = this.getTargetBlock(validation.target);
        if (!_block) {
            return false;
        }
        let targetId = _block.id;
        let block = event;
        // Check that the element that changed is the one we target
        return block.blockId === targetId;
    }
    _matchBlocklyValue(validation : any, event : any) {

        const target = this.editor.querySelector(validation.target);
        const eventBlock = this.workspace.getBlockById(event.blockId)!;
        const field = eventBlock.getField(event.name);

        function validateSource() {
            if (target.field) {
                // Check field directly
                return target.field === field;
            } else if (target.block) {
                // Recursively check the blocks. A matching block return immediately.
                // A shadow block runs again with its parent
                function checkBlock(block : Block) : boolean {
                    // Check this is the block emitting the event
                    if (target.block === block) {
                        return true;
                    }
                    const parent = block.getParent();
                    // If the block is shadow go up the chain and try again
                    if (block.isShadow() && parent) {
                        return checkBlock(parent);
                    }
                    return false;
                }
                return checkBlock(eventBlock);
            }
        }

        if (validateSource()) {
            if (validation.value) {
                // Weak comparison to match numbers too
                return validation.value == event.newValue;
            }
            if (validation.minLength) {
                return event.newValue.length >= validation.minLength;
            }
            return true;
        }

        return false;
    }
    _validate(validation : any, e : any) : boolean {
        let detail = e.data.event,
            block = this.workspace.getBlockById(detail.blockId);
        detail.type = this.eventsMap[detail.type] || detail.type;
        // Ignore connect event with no parent
        // Ignore all events from shadow blocks except `value`
        if (detail.type === 'connect' && !detail.newParentId ||
            detail.type !== 'value' && (block && block.isShadow())) {
            return false;
        }
        return this._checkEvent(validation, detail);
    }
}

export default BlocklyChallenge;
