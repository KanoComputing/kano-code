import { ChallengeBehavior } from '../kano-app-challenge/kano-challenge-behavior.js';

// @polymerBehavior
export const ValidatorBehaviorImpl = {
    properties: {
        stepIds: {
            type: Object,
            value: () => {
                return {};
            }
        }
    },
    ready () {
        this._validators = {};
        this._oppositeActions = {};
        this._matchFallbacks = {};
    },
    _addValidator (type, method) {
        this._validators[type] = method;
    },
    _addMatchFallback (type, method) {
        this._matchFallbacks[type] = method;
    },
    _addOppositeAction (type, oppositeType, checkMethod) {
        this._oppositeActions[type] = this._oppositeActions[type] || {};
        this._oppositeActions[type][oppositeType] = checkMethod;
    },
    /**
     * Goes through all the defined validations and check them
     */
    _checkEvent (validation, detail) {
        Object.keys(validation).forEach((type) => {
            let redirectAction;
            // Type mismatch, check the opposite actions
            if (type !== detail.type) {
                this._isOppositeAction(validation[type], type, detail)
            } else {
                if (this._validateEvent(validation[type], type, detail)) {
                    if (!validation[type].skipSteps) {
                        this.nextStep();
                    } else {
                        this._goToStep(this.step + validation[type].skipSteps + 1);
                    }
                // The matching event didn't pass the checks, find a fallback
                } else {
                    this._validateMatchFallback(validation[type], type, detail);
                }
            }
            if (redirectAction) {
                this._redirectUser(redirectAction, validation[type], detail);
            }
        });
    },
    /**
     * Check whether the received event matches the validation
     */
    _validateEvent (validation, type, detail) {
        // Simple presence validation
        if (validation === true || (validation.value && validation.value === true)) {
            return true;
        }
        // Record changes for `count` type validations
        this.changeCounts[this.step] = this.changeCounts[this.step] + 1 || 1;
        // Run the validator if exists
        if (this._validators[type] && this[this._validators[type]].call(this, validation, detail)) {
            return true;
        }
    },
    _validateMatchFallback (validation, type, detail) {
        let method = this._matchFallbacks[type];
        if (method && typeof this[method] === 'function') {
            return this[method].call(this, validation, detail);
        }
    },
    _getOppositeAction (expected, real) {
        if (this._oppositeActions[expected] && this._oppositeActions[expected][real]) {
            return this._oppositeActions[expected][real];
        }
    },
    _redirectUser (method, validation, detail) {
        if (typeof this[method] === 'function') {
            return this[method].call(this, validation, detail);
        }
    },
    /**
     * Lookup the actions tables and check if the current event goes against the action required
     */
    _isOppositeAction (validation, type, detail) {
        let oppositeAction = this._getOppositeAction(type, detail.type);
        if (oppositeAction) {
            if (typeof this[oppositeAction] === 'function') {
                return this[oppositeAction].call(this, validation, detail);
            }
        }
    },
    _updateTooltip (text, index) {
        index = index || 0;
        this.set(`steps.${this.step}.tooltips.${index}.text`, text);
        this.stepChanged();
    }
};

export const ValidatorBehavior = [ChallengeBehavior, ValidatorBehaviorImpl];