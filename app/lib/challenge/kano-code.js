import BlocklyChallenge from './blockly.js';

// TODO: Use Symbol('store) instead
const PARTS_STORE = 'parts';

class KanoCodeChallenge extends BlocklyChallenge {
    constructor(...args) {
        super(...args);
        this.addValidation('add-part', this.matchAddPart);
        this.addValidation('background', this.matchProperty);
        this.addValidation('select-part', this.matchPartTarget);
        this.addValidation('selected-part-change', this.matchPartChange);
        this.addValidation('trigger', this.matchTrigger);
        this.addValidation('running', this.matchValue);
        this.addValidation('select-new-part', this.matchPartType);
        this.addValidation('enable-refresh', this.matchPartTarget);
        this.addValidation('disable-refresh', this.matchPartTarget);
        this.addValidation('manual-refresh', this.matchPartTarget);
        this.addValidation('open-settings-tooltip', this.matchPartTarget);
        this.addValidation('open-part-settings', this.matchPartTarget);
        this.addValidation('settings-interaction', this.matchSettingsInteraction);
        this.addValidation('light-animation-tool-changed', this.matchValue);
        this.addValidation('light-animation-paint', this.matchTool);
        this.addValidation('light-animation-preview-changed', this.matchValue);

        this.addOppositeAction('add-part', 'close-parts', this._partsClosed);

        this.defineShorthand('create-part', this._createPartShorthand.bind(this));
    }
    _getOpenPartsDialogStep(data) {
        return {
            validation: {
                'open-parts': true,
            },
            beacon: {
                target: 'add-part-button',
            },
            banner: {
                text: data.openPartsCopy || 'Open the parts dialog',
            },
        };
    }
    _getCreatePartStep(data) {
        return {
            validation: {
                'add-part': {
                    type: data.part,
                    id: data.alias,
                },
            },
            beacon: {
                target: `parts-panel-${data.part}`,
            },
            tooltips: [{
                text: data.addPartCopy || `Click '${data.part}' to add it.`,
                position: 'top',
                location: 'parts-panel',
            }],
        };
    }
    _createPartShorthand(data) {
        const openPartsDialogStep = this._getOpenPartsDialogStep(data);
        const createStep = this._getCreatePartStep(data);
        const steps = [openPartsDialogStep, createStep];
        return steps;
    }
    _updateStep() {
        super._updateStep();
        this.trigger('step-changed');
    }
    _partsClosed() {
        if (this.stepIndex > 0) {
            this.stepIndex -= 1;
        }
    }
    matchTrigger(validation, event) {
        let { emitter } = validation;
        if (emitter.part) {
            emitter = this.getFromStore(PARTS_STORE, emitter.part);
        }
        return emitter === event.trigger.emitter &&
                validation.event === event.trigger.event;
    }
    matchPartChange(validation, event) {
        return this.matchProperty(validation, event);
    }
    matchPartTarget(validation, event) {
        const target = this.getFromStore(PARTS_STORE, validation.target);
        if (!event.part && validation.target) {
            return false;
        }
        return target === event.part.id;
    }
    /**
     * Will tell if a property defined in a validation and an event matches
     * Example:
     * The validation says: 'userStyle.background' and the event says
     * 'userStyle.background', the properties match
     * The story creator can define a step that just wait for a vague action
     * to be made:
     * validation: 'position.*' will match things like 'position.x' and
     * 'position.y'
     */
    matchProperty(validation, event) {
        // Split the properties paths
        let validationParts = validation.property.split('.'),
            eventParts = event.property.split('.'),
            count = this.changeCounts[this.step];
        // Loop through the smallest part
        for (let i = 0, len = validationParts.length; i < len; i++) {
            // If the validation used the joker, the remaining parts are accepted
            if (validationParts[i] === '*') {
                break;
            }
            // If the part doesn't match, stop
            if (validationParts[i] !== eventParts[i]) {
                return false;
            }
        }
        if (validation.count) {
            if (count < validation.count) {
                return false;
            }
        }
        if (typeof validation.value !== 'undefined') {
            return this.matchValue(validation, event);
        }

        return true;
    }
    _processPart(part) {
        if (part.target && part.type) {
            const partId = this.getFromStore(PARTS_STORE, part.target);
            const blockId = `${partId}#${part.type}`;
            part.type = blockId;
            return part;
        } else if (part.part && part.type) {
            const partId = this.getFromStore(PARTS_STORE, part.part);
            return `${partId}#${part.type}`;
        } else if (part.part) {
            return this.getFromStore(PARTS_STORE, part.part) || part;
        } else if (part.rawPart) {
            return part.rawPart;
        }
        return part;
    }
    matchValue(validation, event) {
        return validation.value === event.value;
    }
    matchTool(validation, event) {
        return validation.tool === event.tool;
    }
    matchAddPart(validation, event) {
        // Check the type of the added part
        if (!this.matchPartType(validation, event)) {
            return false;
        }
        // If an id is provided, save the id of the added part
        if (validation.id) {
            this.addToStore(PARTS_STORE, validation.id, event.data.part.id);
        }
        return true;
    }
    matchPartType(validation, event) {
        return validation.type === event.data.part.type;
    }
    matchSettingsInteraction(validation, event) {
        return validation.setting === event.setting;
    }
    get done() {
        return this.stepIndex === this.steps.length - 1;
    }
    _getOpenFlyoutStep(data) {
        const step = super._getOpenFlyoutStep(data);
        return Object.assign(step, {
            banner: {
                text: data.openFlyoutCopy || `Open the ${data.category} category`,
            },
            beacon: {
                target: {
                    category: data.category,
                },
            },
        });
    }
    _getCreateBlockStep(data) {
        const step = super._getCreateBlockStep(data);
        return Object.assign(step, {
            banner: {
                text: data.grabBlockCopy || 'Grab this block',
            },
            beacon: {
                target: {
                    flyout_block: data.blockType,
                },
            },
        });
    }
    _getConnectBlockStep(data) {
        const step = super._getConnectBlockStep(data);
        return Object.assign(step, {
            banner: {
                text: data.connectCopy || 'Connect to this block',
            },
            beacon: {
                target: {
                    block: data.connectTo,
                },
            },
        });
    }
    _getDropBlockStep(data) {
        const step = super._getDropBlockStep(data);
        return Object.assign(step, {
            banner: {
                text: data.dropCopy || 'Drop this block anywhere in your code space',
            },
        });
    }
    _changeInputShorthand(data) {
        const step = super._changeInputShorthand(data);
        Object.assign(step, {
            banner: {
                text: data.bannerCopy || `Change this value to ${data.value}`,
            },
            beacon: {
                target: { block: data.block },
            },
        });
        return step;
    }
}

export default KanoCodeChallenge;
