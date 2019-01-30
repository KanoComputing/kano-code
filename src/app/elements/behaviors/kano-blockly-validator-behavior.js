import { CopyManager } from '../../scripts/kano/make-apps/copy-manager.js';
import { ValidatorBehavior } from './kano-validator-behavior.js';

// @polymerBehavior
export const BlocklyValidatorBehaviorImpl = {
    properties: {
        blockIds: {
            type: Object,
            value: () => {
                return {};
            }
        }
    },
    observers: [
        '_stepChanged(step)'
    ],
    ready () {
        this.eventsMap = {
            move: 'connect',
            change: 'value',
            'drop-block': 'drop'
        };
        this._addValidator('blockly', '_checkBlocklyEvent');
        this._addValidator('create', '_matchCreate');
        this._addValidator('connect', '_matchConnect');
        this._addValidator('value', '_matchBlocklyValue');
        this._addValidator('delete', '_matchDelete');
        this._addValidator('open-flyout', '_matchCategory');
        this._addValidator('drop', '_matchDrop');

        this._addOppositeAction('create', 'close-flyout', '_flyoutClosed');
        this._addOppositeAction('connect', 'create', '_createNotExpected');
        this._addOppositeAction('connect', 'delete', '_deleteNotExpected');

        this._addMatchFallback('connect', '_wrongConnection');
        this._addMatchFallback('create', '_wrongCreate');
        this._addMatchFallback('open-flyout', '_wrongCategory');
    },
    _stepChanged () {
        // On validation or step change, force close the widget div
        Blockly.WidgetDiv.hide();
    },
    _wrongCategory (validation, detail) {
        let step = this.steps[this.step];
        step.banner = CopyManager.get('wrong-category-opened');
        step.beacon = {
            target: {
                category: validation
            }
        };
        this._updateStep(step);
    },
    _deleteNotExpected (validation, detail) {
        // Ignore delete events from shadow blocks
        if (detail.oldXml.tagName.toLowerCase() === 'shadow') {
            return;
        }
        this._prevStep(3);
    },
    _createNotExpected (validation, detail) {
        return this._wrongCreateRedirect(detail.blockId);
    },
    _wrongConnection (validation, detail) {
        // Only take action if the block was plugged
        if (detail.newParentId) {
            return this._wrongConnectionRedirect(validation, detail);
        }
    },
    _wrongCreate (validation, detail) {
        return this._wrongCreateRedirect(detail.blockId);
    },
    _wrongCreateRedirect (wrongBlockId) {
        let step = {};
        step.validation = {
            blockly: {
                delete: {
                    target: {
                        rawId: wrongBlockId
                    }
                }
            }
        };
        step.banner = {
            text: CopyManager.get('wrong-block-added') + '<br>' + CopyManager.get('put-block-in-bin')
        };
        step.beacon = {
            target: 'blockly-bin'
        };
        this._injectStep(step, -1);
    },
    _wrongConnectionRedirect (validation, detail) {
        let step = this.steps[this.step];
        // update the tooltip's copy
        step.banner = CopyManager.get('wrong-block-connection');
        // Add a boucing arrow
        step.beacon = {
            target: { block: validation.parent }
        };
        this._updateStep(step);
    },
    _flyoutClosed (validation, detail) {
        return this._prevStep();
    },
    _matchCategory (validation, event) {
        if (validation.part || validation.rawPart) {
            validation = validation.part ? this.stepIds[validation.part] : validation.rawPart;
        } else if (validation.value) {
            validation = validation.value;
        }
        return event.categoryId === validation;
    },
    _matchBlockType (type, event) {
        return event.xml.getAttribute('type') === type;
    },
    getBlockType (validation) {
        let target = validation.target ? this.stepIds[validation.target] : validation.rawTarget,
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
    },
    _matchDelete (validation, event) {
        let target = validation.target || validation,
            blockId;
        if (typeof target === 'string') {
            blockId = this.blockIds[target];
        } else if (target.id) {
            blockId = this.blockIds[target.id];
        } else if (target.rawId) {
            blockId = target.rawId;
        }
        if (blockId !== event.blockId) {
            return;
        }
        delete this.blockIds[target];
        return true;
    },
    _matchCreate (validation, event) {
        let type = this.getBlockType(validation);
        // Check the type of the added block
        if (this._matchBlockType(type, event)) {
            // The new block created is added to the step, using its
            // step id for further reference
            if (validation.id) {
                this.blockIds[validation.id] = event.blockId;
            }
            return true;
        }
    },
    _matchConnect (validation, event) {
        // Extract the validation object, target and parent step ids and
        // the block moved
        let target = this.getTargetBlock(validation.target),
            parent = this.getTargetBlock(validation.parent);

        // Check that the element moved is the one targeted and that its
        // new parent is the right one
        if (event.blockId === target.id && event.newParentId === parent.id) {
            let connection;

            if (!validation.parent.inputName) {
                connection = parent.nextConnection
            } else {
                let input = parent.getInput(validation.parent.inputName)

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
    },
    _matchDrop (validation, event) {
        let targetId = this.getTargetBlock(validation.target).id,
            block = event;
        // Check that the element that changed is the one we target
        return block.blockId === targetId;
    },
    _matchBlocklyValue (validation, event) {
        let targetId = this.getTargetBlock(validation.target).id,
            block = event,
            failed = false,
            workspaceBlock, newValue;
        // Check that the element that changed is the one we target
        if (block.blockId === targetId) {
            workspaceBlock = this.editor.getBlocklyWorkspace().getBlockById(block.blockId)
            newValue = workspaceBlock.getFieldValue(block.name);
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
                let value = validation.value;
                if (value.event_from) {
                    value = `${this.stepIds[value.event_from]}.${value.event}`;
                }
                if (newValue != value) {
                    failed = true;
                }
            }
            return !failed;
        }
    },
    getTargetBlock (selector) {
        let block;
        if (typeof selector === 'string') {
            block = this.editor.getBlocklyWorkspace().getBlockById(this.blockIds[selector]);
        } else if (selector.id) {
            block = this.editor.getBlocklyWorkspace().getBlockById(this.blockIds[selector.id]);
        } else if (selector.rawId) {
            block = this.editor.getBlocklyWorkspace().getBlockById(selector.rawId);
        }
        if (selector.shadow) {
            block = block.getInput(selector.shadow).connection.targetBlock();
        }
        return block;
    },
    _checkBlocklyEvent (validation, e) {
        let blocklyStep = validation,
            detail = e.event,
            block = this._blocklyWorkspace.getBlockById(detail.blockId);
        detail.type = this.eventsMap[detail.type] || detail.type;
        // Ignore connect event with no parent
        // Ignore all events from shadow blocks except `value`
        if (detail.type === 'connect' && !detail.newParentId ||
            detail.type !== 'value' && (block && block.isShadow())) {
            return;
        }
        this._checkEvent(validation, detail);
    },
    setWorkspace (ws) {
        this._blocklyWorkspace = ws;
    }
};

export const BlocklyValidatorBehavior = [ValidatorBehavior, BlocklyValidatorBehaviorImpl];
