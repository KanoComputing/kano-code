import { Workspace, Block, Blockly, Input, Connection } from '@kano/kwc-blockly/blockly.js';
import { Editor } from '../../../editor/editor.js';
import { BlocklySourceEditor } from '../../blockly.js';
import { Engine } from '../../../challenge/engine.js';

class BlocklyChallenge extends Engine {
    public workspace? : Workspace;
    protected eventsMap : { [K : string] : string };
    public developmentMode = false;
    constructor(editor : Editor) {
        super(editor);
        if (this.editor.sourceType !== 'blockly') {
            throw new Error('Cannot use a blockly challenge with non-blockly editor');
        }
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
        this.defineShorthand('start-step', this._startStepShorthand.bind(this));

        this.defineBehavior('phantom_block', this._onPhantomBlockEnter.bind(this), this._onPhantomBlockLeave);
    }
    getWorkspace() {
        if (!this.workspace) {
            this.workspace = (this.editor.sourceEditor as BlocklySourceEditor).getWorkspace();
        }
        return this.workspace;
    }
    _updateStep() {
        super._updateStep();
        Blockly.WidgetDiv.hide();
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
        if (phantom_block.connectOffset) {
            this.setPhantomBlockByPosition();
            return;
        } else if (typeof phantom_block !== 'string' ||
            !Blockly.selected) {
            return;
        }
        const target = Blockly.selected;
        const result = this.editor.querySelector(phantom_block);
        if (!result) {
            return false;
        }
        let connection = result.connection as Connection;

        if (connection) {
            Blockly.setPhantomBlock(connection, target);
            return;
        }

        const input = result.input as Input;

        if (!input || !input.connection) {
            return;
        }
        connection = input.connection;
        Blockly.setPhantomBlock(connection, target);
    }
    setPhantomBlockByPosition() {
        const target = Blockly.selected;
        const workspace = this.getWorkspace();
        const topBlock = workspace.topBlocks_[0];
        const position = {
            x: 0,
            y: 0,
        };
        Blockly.setPhantomBlockByPosition(workspace, target);
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
                        type: `${data.category}>flyout-block.${data.blockType}`,
                        alias: data.alias,
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
                        target: `alias#${data.alias}`,
                    },
                },
            },
            phantom_block: data.connectTo,
        };
    }
    _getDropBlockStep(data : any) {
        return {
            validation: {
                blockly: {
                    drop: {
                        target: `alias#${data.alias}`,
                    },
                },
            },
        };
    }
    _getDropBlockOffsetStep(data : any) {
        return {
            validation: {
                blockly: {
                    drop: {
                        target: `alias#${data.alias}>offset`,
                    },
                },
            },
            phantom_block: data,
        };
    }
    _startStepShorthand(data : any) {
        if (!this.developmentMode) {
            return [];
        }
        return data;
    }
    _createBlockShorthand(data : any) {
        const openFlyoutStep = this._getOpenFlyoutStep(data);
        const createStep = this._getCreateBlockStep(data);
        const steps : any[] = [createStep];
        const workspace = this.getWorkspace();
        if (workspace.toolbox_) {
            steps.unshift(openFlyoutStep);
        }
        if (data.connectOffset) {
            steps.push(this._getDropBlockOffsetStep(data));
        } else if (data.connectTo) {
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
                        target: data.target,
                        value: data.value,
                        skipCheck : data.skipCheck,
                    },
                },
            },
        };
    }
    /**
     * Check if the event is about a specific toolbox entry
     * @param toolboxEntry An id for a toolbox entry
     * @param event An event from the Blockly workspace
     */
    _matchCategory(toolboxEntry : string, event : any) {
        const result = this.editor.querySelector(toolboxEntry);
        if (!result) {
            return false;
        }
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
    /**
     * Check whether the create event received matches the expected validation
     * @param validation A validation object defined in a challenge step
     * @param event An event from the Blockly workspace
     */
    _matchCreate(validation : any, event : any) {
        const result = this.editor.querySelector(validation.type);
        if (!result || !result.block) {
            return false;
        }
        const { type } = result.block;
        // Check the type of the added block
        if (this._matchBlockType(type, event)) {
            // The new block created is added to the step, using its
            // step id for further reference
            if (validation.alias) {
                // Create an alias selector for that block
                this.registerAlias(validation.alias, `block#${event.blockId}`);
            }
            return true;
        }
        return false;
    }
    /**
     * Check whether the connect event received matches the expected validation
     * @param validation A validation object defined in a challenge step
     * @param event An event from the Blockly workspace
     */
    _matchConnect(validation : any, event : any) {
        const result = this.editor.querySelector(validation.target);
        if (!result) {
            return false;
        }
        // Extract the validation object, target and parent step ids and the block connected
        const target = result.block as Block;
        // const parent = this.editor.querySelector(validation.parent).input as Input;
        const parentResult = this.editor.querySelector(validation.parent);
        if (!parentResult) {
            return false;
        }
        let connection = parentResult.connection as Connection;

        // Check that the element moved is the one targeted and that its new parent is the right one
        if (target && parentResult && event.blockId === target.id) {
            if (!connection) {
                const input = parentResult.input as Input;
                if (!input.connection) {
                    return false;
                }
                connection = input.connection;
            }
            // No connection attached to the input, fail
            if (!connection) {
                return false;
            }
            // Check that the block attached to the defined connection if the targetted one
            connection = connection.targetConnection;
            /**
             * Check whether the block's ancestry contains the target connection
             * @param block A block whose ancestry might contain the connection
             */
            function step(block : Block) : boolean {
                // Get the parent connection
                const blockConnection = block.outputConnection || block.previousConnection;
                // No connection, bail out
                if (!blockConnection) {
                    return false;
                }
                // Connection is the one we're looking for, success
                if (blockConnection === connection) {
                    return true;
                }
                // Get the parent block
                const parentBlock = block.getParent();
                // No parent block, reach the top
                if (!parentBlock) {
                    return false;
                }
                // Has a parent block, recursively check
                return step(parentBlock);
            }
            return step(target);
        }
        return false;
    }
    /**
     * Check whether a block dropped on the workspace matches the expected block
     * @param validation A validation object defined in a challenge step
     * @param event An event from the Blockly workspace
     */
    _matchDrop(validation : any, event : any) {
        const result = this.editor.querySelector(validation.target);
        if (!result) {
            return false;
        }
        const id = result.getId();
        // Check that the element that changed is the one we target
        return event.blockId === id;
    }
    /**
     * Check wether the value change event from blockly matches the validation
     * @param validation A validation object defined in a challenge step
     * @param event An event from the Blockly workspace
     */
    _matchBlocklyValue(validation : any, event : any) {
        const workspace = this.getWorkspace();
        // Retrieve the block expected to trigger the event
        const target = this.editor.querySelector(validation.target);
        // Retrieve the block that effectively triggered the event
        const eventBlock = workspace.getBlockById(event.blockId)!;
        // Retrieve the field that triggered the event
        const field = eventBlock.getField(event.name);

        /**
         * Check the source of the event against the expected target declared in the challenge step
         */
        function validateSource() {
            if (!target) {
                return false;
            }
            if (target.field) {
                // Check field directly
                return target.field === field;
            } else if (target.block) {
                // Recursively check the blocks. A matching block return immediately.
                // A shadow block runs again with its parent
                function checkBlock(block : Block) : boolean {
                    if (!target) {
                        return false;
                    }
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
            } else if (target.input) {
                const input = target.input as Input;
                if (!input.connection) {
                    return false;
                }
                const connectedBlock = input.connection.getSourceBlock();
                // Check the target input's connection and matches it with the block emitting the event
                function checkInput(block : Block) : boolean {
                    // Connected block is the emitter, validate
                    if (connectedBlock === block) {
                        return true;
                    }
                    // Grab the parent and run the check again. Until no more shadow
                    const parent = block.getParent();
                    // If the block is shadow go up the chain and try again
                    if (block.isShadow() && parent) {
                        return checkInput(parent);
                    }
                    return false;
                }
                return checkInput(eventBlock);
            }
        }

        // If the source matches, validate the provided value
        if (validateSource()) {
            if (validation.value && !validation.skipCheck) {
                // Check whether the new value is a variable id, if so match against the variable name
                const variable = workspace.getVariableById(event.newValue);
                if (variable) {
                    return validation.value == variable.name;
                }
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
        const workspace = this.getWorkspace();
        let detail = e.data.event;
        let block = workspace.getBlockById(detail.blockId);
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
