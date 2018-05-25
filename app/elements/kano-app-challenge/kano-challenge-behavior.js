import '../../../../../twemoji-min/2/twemoji.min.js';

export const ChallengeBehavior = {
    properties: {
        steps: {
            type: Object
        },
        step: {
            type: Number,
            notify: true
        },
        selectedStep: {
            type: Object,
            computed: 'computeSelectedStep(steps, step, started)',
            notify: true
        },
        started: {
            type: Boolean,
            value: false
        },
        sceneVariables: Object
    },
    forceReloadStep () {
        this.started = false;
        this.started = true;
    },
    computeSelectedStep () {
        let selectedStep;
        if (!this.started) {
            return null;
        }

        selectedStep = this.steps[this.step];

        if (!selectedStep) {
            return null;
        }

        // Deep clone the step to not change the original step when updating the ids
        selectedStep = JSON.parse(JSON.stringify(selectedStep));

        if (selectedStep.banner && selectedStep.banner.text) {
            selectedStep.banner.text = this._processMarkdown(selectedStep.banner.text);
        }

        if (selectedStep.tooltips) {
            selectedStep.tooltips = selectedStep.tooltips.map(tooltip => {
                tooltip.location = this.processLocation(tooltip.location);
                tooltip.text = this._processMarkdown(tooltip.text || '');
                return tooltip;
            });
        }
        if (selectedStep.arrow) {
            selectedStep.arrow.source = this.processLocation(selectedStep.arrow.source);
            selectedStep.arrow.target = this.processLocation(selectedStep.arrow.target);
        }
        if (selectedStep.beacon) {
            selectedStep.beacon.target = this.processLocation(selectedStep.beacon.target);
        }
        selectedStep.highlight = this.processLocation(selectedStep.highlight);
        if (selectedStep.phantom_block) {
            selectedStep.phantom_block.location = this.processLocation(selectedStep.phantom_block.location);
        }
        if (selectedStep.modal) {
            selectedStep.modal.text = this._processMarkdown(selectedStep.modal.text);
        }
        if (selectedStep.reward) {
            selectedStep.play_on_end = "puzzle_success";
        }
        return selectedStep;
    },
    /**
     * Changes the location to adapt to the current context
     */
    processLocation (location) {
        if (typeof location === 'object') {
            if (location.category) {
                let cat = location.category;
                if (cat.part) {
                    location.category = this.stepIds[cat.part];
                } else if (cat.rawPart) {
                    location.category = cat.rawPart;
                }
            } else if (location.flyout_block) {
                let type = location.flyout_block,
                    partId;
                if (type.part) {
                    partId = this.stepIds[type.part];
                } else if (type.rawPart) {
                    partId = type.rawPart;
                }
                if (partId) {
                    location.flyout_block = `${partId}#${type.type}`;
                }
            } else if (location.path && (location.part || location.rawPart)) {
                let partId = location.part ? this.stepIds[location.part] : location.rawPart;
                location = `${location.path}-part-${partId}`;
            } else if (location.part || location.rawPart) {
                location.part = location.part ? this.stepIds[location.part] : location.rawPart;
            } else if (location.block) {
                if (typeof location.block === 'string') {
                    location.block = {
                        id: this.blockIds[location.block]
                    };
                } else if (location.block.id) {
                    location.block.id = this.blockIds[location.block.id];
                } else if (location.block.rawId) {
                    location.block.id = location.block.rawId;
                }
            }
        }
        return location;
    },
    _processMarkdown (text) {
        let processedText = text,
            blockReg = /<kano-blockly-block(.*)type="(.+)"(.*)><\/kano-blockly-block>/g;

        processedText = processedText.replace(blockReg, (match, before, type, after) => {
            let pieces = type.split('#');
            if (pieces.length > 1) {
                pieces[0] = this.stepIds[pieces[0]] || pieces[0];
            }
            type = pieces.join('#');
            return `<kano-blockly-block${before}type="${type}"${after}></kano-blockly-block>`;
        });

        //Inject variables to markdown syntax
        processedText = Object.keys(this.sceneVariables).reduce((acc, key) => {
            return acc.replace(new RegExp('\\$\\{' + key + '\\}', 'g'), this.sceneVariables[key] || '');
        }, processedText);


        /* Replace native emoji and return */
        return twemoji.parse(processedText);
    },
    /**
     * Move to the next step or set the challenge as done
     */
    nextStep () {
        // The current step was injected, we remove it form the array
        if (this.selectedStep.injected) {
            this.splice('steps', this.step, 1);
            // Use `_goToStep` to force a refresh of the current step
            this._goToStep(this.step);
        } else {
            if (this.step < this.steps.length - 1) {
                this.step++;
            }
            // Check if it's the last step
            if (this.step === this.steps.length - 1) {
                this.set('selectedStep.isLast', true);
                this.set('done', true);
                this.fire('scene-done');
            }
        }
    },
    stepChanged () {
        this.selectedStep = this.computeSelectedStep();
    },
    _prevStep (n=1) {
        this._goToStep(Math.max(0, this.step - n));
    },
    _getStateAt (index) {
        let state = {
            hints: {
                enabled: true
            }
        };
        for (let i = 0; i < this.steps.length; i++) {
            if ('set-state' in this.steps[i]) {
                Object.assign(state, this.steps[i]['set-state']);
            }
        }
        return state;
    },
    _goToStep (index) {
        let step = index,
            start = Math.min(this.step, index),
            end = Math.max(this.step, index),
            diff = index - this.step,
            direction = 1,
            state;
        // Compute the direction of the jump
        if (diff !== 0) {
            direction = (diff / Math.abs(diff));
        }
        // Calculate real diff by adding the steps to skip
        for (; start < end; start++) {
            if ('set-state' in this.steps[start]) {
                // Add the steps to skip in the diff
                diff += direction;
                end += direction;
            }
        }
        step = this.step + diff;
        // Jumping through step time means that the state can be wrong. Get the state at that point
        state = this._getStateAt(step);
        // Force a change notification
        if (this.step === step) {
            this.set('step', step - 1);
        }
        // Apply the latest state
        this.set('state', state);
        this.set('step', step);
    },
    _injectStep (step, offset) {
        let index = this.step + (typeof offset === 'undefined' ? 1 : offset);
        step.injected = true;
        // Insert the new step just after that
        this.splice('steps', index, 0, step);
        // jump to the new step
        this._goToStep(index);
    },
    _updateStep (step) {
        step.injected = true;
        this.set(`steps.${this.step}`, step);
        this.stepChanged();
    }
};