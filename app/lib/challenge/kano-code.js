import BlocklyChallenge from './blockly.js';

const PARTS_STORE = Symbol('store');

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
            this.addToStore(PARTS_STORE, validation.id, event.part.id);
        }
        return true;
    }
    matchPartType(validation, event) {
        return validation.type === event.part.type;
    }
    matchSettingsInteraction(validation, event) {
        return validation.setting === event.setting;
    }
    get done() {
        return this.stepIndex === this.steps.length - 1;
    }
    _createBlockShorthand(data) {
        const steps = super._createBlockShorthand(data);

        Object.assign(steps[0], {
            banner: {
                text: data.openFlyoutCopy || `Open the ${data.category} category`,
            },
            beacon: {
                target: {
                    category: data.category,
                },
            },
        });

        Object.assign(steps[1], {
            banner: {
                text: data.grabBlockCopy || 'Grab this block',
            },
            beacon: {
                target: {
                    flyout_block: data.blockType,
                },
            },
        });

        if (steps[2]) {
            Object.assign(steps[2], {
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

        return steps;
    }
    _changeInputShorthand(data) {
        const step = super._changeInputShorthand(data);
        Object.assign(step, {
            banner: {
                text: data.bannerCopy || `Change this value to ${data.value}`,
            },
            beacon: {
                target: data.block,
            },
        });
        return step;
    }
}

export default KanoCodeChallenge;
