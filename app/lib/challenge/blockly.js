import Challenge from 'challenge-engine/definition.js';

class BlocklyChallenge extends Challenge {
    constructor(workspace) {
        super();
        this.workspace = workspace;
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
        this.addValidation('drop', this._matchDrop);

        this.addOppositeAction('create', 'close-flyout', this._flyoutClosed.bind(this));
        this.addOppositeAction('connect', 'delete', this._deleteNotExpected.bind(this));

        this.addMatchFallback('open-flyout', this._wrongCategory.bind(this));

        this.defineShorthand('create-block', this._createBlockShorthand.bind(this));
        this.defineShorthand('change-input', this._changeInputShorthand.bind(this));

        this.defineBehavior('phantom_block', this._onPhantomBlockEnter.bind(this), this._onPhantomBlockLeave);

        this.createStore('blocks');
    }
    _updateStep(...args) {
        super._updateStep.apply(this, ...args);
        Blockly.WidgetDiv.hide();
    }
    _processBlock(block) {
        if (block.id) {
            block.id = this.getFromStore('blocks', block.id);
        } else if (block.rawId) {
            block.id = block.rawId;
        }
        return block;
    }
    _wrongCategory(validation) {
        this._updateStep();
    }
    _deleteNotExpected(validation, detail) {
        // Ignore delete events from shadow blocks
        if (detail.oldXml.tagName.toLowerCase() === 'shadow') {
            return;
        }
        this.stepIndex -= 2;
    }
    _flyoutClosed(validation) {
        this.stepIndex -= 1;
    }
    _onPhantomBlockEnter(phantom_block) {
        let connection,
            target,
            host;

        if (!phantom_block ||
            !phantom_block.location ||
            !Blockly.selected) {
            return;
        }
        host = this.getTargetBlock(phantom_block.location.block);

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
    _onPhantomBlockLeave(data) {
        Blockly.removePhantomBlock();
    }
    _getOpenFlyoutStep(data) {
        return {
            validation: {
                blockly: {
                    'open-flyout': data.category,
                },
            },
        };
    }
    _getCreateBlockStep(data) {
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
    _getConnectBlockStep(data) {
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
    _getDropBlockStep(data) {
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
    _createBlockShorthand(data) {
        const openFlyoutStep = this._getOpenFlyoutStep(data);
        const createStep = this._getCreateBlockStep(data);
        const steps = [createStep];
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
    _changeInputShorthand(data) {
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
    getBlockType(validation) {
        let target = validation.target ? this.getFromStore('blocks', validation.target) : validation.rawTarget,
            type;
        // Use the type or the value directly
        // Allows to declare shorthand creation as:
        // create: 'text'
        // or
        // create: {
        //     type: 'text'
        // }
        if (typeof validation === 'string') {
            type = validation;
        } else if (validation.type) {
            type = validation.type;
            type = target ? `${target}#${type}` : type;
        }
        return type;
    }
    getTargetBlock(selector) {
        let block;
        if (typeof selector === 'string') {
            block = this.workspace.getBlockById(this.getFromStore('blocks', selector));
        } else if (selector.id) {
            block = this.workspace.getBlockById(this.getFromStore('blocks', selector.id));
        } else if (selector.rawId) {
            block = this.workspace.getBlockById(selector.rawId);
        }
        if (selector.shadow) {
            block = this.getTargetBlockShadow(block, selector.shadow);
        }
        return block;
    }
    getTargetBlockShadow(block, selector) {
        if (typeof selector === 'string') {
            return block.getInput(selector).connection.targetBlock();
        } else if ('shadow' in selector && 'name' in selector) {
            return this.getTargetBlockShadow(block.getInput(selector.name).connection.targetBlock(), selector.shadow);
        }
        return null;
    }
    _matchCategory(validation, event) {
        if (validation.value) {
            validation = validation.value;
        }
        return event.categoryId === validation;
    }
    _matchBlockType(type, event) {
        return event.xml.getAttribute('type') === type;
    }
    _matchDelete(validation, event) {
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
            return;
        }
        delete this._stores.blocks[target];
        return true;
    }
    _matchCreate(validation, event) {
        const type = this.getBlockType(validation);
        // Check the type of the added block
        if (this._matchBlockType(type, event)) {
            // The new block created is added to the step, using its
            // step id for further reference
            if (validation.id) {
                this.addToStore('blocks', validation.id, event.blockId);
            }
            return true;
        }
    }
    _matchConnect(validation, event) {
        // Extract the validation object, target and parent step ids and
        // the block moved
        let target = this.getTargetBlock(validation.target),
            parent = this.getTargetBlock(validation.parent);

        // Check that the element moved is the one targeted and that its
        // new parent is the right one
        if (event.blockId === target.id && event.newParentId === parent.id) {
            let connection;

            if (!validation.parent.inputName || validation.parent.inputName === '@next') {
                connection = parent.nextConnection;
            } else {
                const input = parent.getInput(validation.parent.inputName);

                if (input) {
                    connection = input.connection;
                } else {
                    return false;
                }
            }

            if (!connection) {
                return false;
            }

            connection = connection.targetConnection;
            return (connection.sourceBlock_.id === target.id);
        }
    }
    _matchDrop(validation, event) {
        let targetId = this.getTargetBlock(validation.target).id,
            block = event;
        // Check that the element that changed is the one we target
        return block.blockId === targetId;
    }
    _matchBlocklyValue(validation, event) {
        const targetId = this.getTargetBlock(validation.target).id;
        const eventBlock = this.workspace.getBlockById(event.blockId);
        const block = eventBlock;
        let failed = false;
        if (block.id !== targetId) {
            return false;
        }
        const newValue = eventBlock.getFieldValue(event.name);
        if (validation.minLength &&
            newValue.length &&
            newValue.length < validation.minLength) {
            failed = true;
        }
        // Check that
        // the value is set to the one we expect
        // We use the double equal to be sure we catch Number/String
        // parsing
        if (validation.value) {
            let { value } = validation;
            if (value.event_from) {
                value = `${this.stepIds[value.event_from]}.${value.event}`;
            }
            /* eslint eqeqeq: "off" */
            if (newValue != value) {
                failed = true;
            }
        }
        return !failed;
    }
    _validate(validation, e) {
        let blocklyStep = validation,
            detail = e.data.event,
            block = this.workspace.getBlockById(detail.blockId);
        detail.type = this.eventsMap[detail.type] || detail.type;
        // Ignore connect event with no parent
        // Ignore all events from shadow blocks except `value`
        if (detail.type === 'connect' && !detail.newParentId ||
            detail.type !== 'value' && (block && block.isShadow())) {
            return;
        }
        this._checkEvent(validation, detail);
    }
}

export default BlocklyChallenge;
