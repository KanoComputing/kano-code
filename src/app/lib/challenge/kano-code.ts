import BlocklyChallenge from './blockly.js';
import { Editor } from '../editor/editor.js';
import { BannerWidget } from './widget/banner.js';
import { BeaconWidget } from './widget/beacon.js';
import { IEditorWidget } from '../editor/widget/widget.js';
import { subscribeTimeout, IDisposable } from '@kano/common/index.js';
import { Part } from '../parts/part.js';
import { Tooltip } from './widget/tooltip.js';

// TODO: Use Symbol('store) instead
const PARTS_STORE = 'parts';

export class KanoCodeChallenge extends BlocklyChallenge {
    protected editor : Editor;
    public widgets : Map<string, IEditorWidget> = new Map();
    private _beaconSub? : IDisposable;
    private tooltips : Tooltip[] = [];
    constructor(editor : Editor) {
        super(editor);
        this.editor = editor;
        this.addValidation('add-part', this.matchAddPart);
        this.addValidation('trigger', this.matchTrigger);
        this.addValidation('running', this.matchValue);
        this.addValidation('select-new-part', this.matchPartType);
        this.addValidation('enable-refresh', this.matchPartTarget);
        this.addValidation('disable-refresh', this.matchPartTarget);
        this.addValidation('manual-refresh', this.matchPartTarget);
        this.addValidation('open-settings-tooltip', this.matchPartTarget);

        this.addOppositeAction('add-part', 'close-parts', this._partsClosed);

        this.defineShorthand('create-part', this._createPartShorthand.bind(this));

        this.defineBehavior('banner', this.displayBanner.bind(this), this.hideBanner.bind(this));
        this.defineBehavior('beacon', this.displayBeacon.bind(this), this.hideBeacon.bind(this));
        this.defineBehavior('tooltips', this.displayTooltips.bind(this), this.hideTooltips.bind(this));

        // TODO: dispose cycle
        this.workspace.addChangeListener(() => {
            this.widgets.forEach((w) => this.editor.layoutContentWidget(w));
        });

        this.editor.parts.onDidOpenAddParts(() => {
            this.triggerEvent('open-parts');
        });
        this.editor.parts.onDidAddPart((part) => {
            this.triggerEvent('add-part', part);
        });
    }
    displayTooltips(tooltips : any[]) {
        tooltips.forEach((tooltipData) => {
            const tooltip = new Tooltip();
            this.editor.addContentWidget(tooltip);
            this.tooltips.push(tooltip);
            if (tooltipData.text) {
                tooltip.setText(tooltipData.text);
            }
            if (tooltipData.position) {
                tooltip.setPosition(tooltipData.position);
            }
            tooltip.setOffset(tooltipData.offset || 0);
            if (tooltipData.target) {
                const target = this.editor.queryElement(tooltipData.target);
                if (!target) {
                    // TODO: error managment
                    return;
                }
                tooltip.layout(target as HTMLElement);
            }
        });
    }
    hideTooltips() {
        this.tooltips.forEach((tooltip) => {
            tooltip.close().then(() => {
                this.editor.removeContentWidget(tooltip);
                tooltip.dispose();
            });
        });
        this.tooltips.length = 0;
    }
    displayBanner(data : any) {
        const widget = new BannerWidget(this.editor);
        widget.onDidClick(() => this.nextStep());
        let text;
        let nextButton = false;
        if (typeof data === 'string') {
            text = data;
        } else if (typeof data.text === 'string') {
            text = data.text;
            nextButton = !!data.nextButton;
        }
        widget.setData({
            text,
            nextButton,
        });
        widget.show();
        this.widgets.set('banner', widget);
    }
    hideBanner() {
        const widget = this.widgets.get('banner');
        if (!widget) {
            return;
        }
        widget.hide();
    }
    displayBeacon(data : any) {
        if (typeof data !== 'string') {
            throw new Error('Beacon prop must be a string');
        }
        // Create beacon with a delay, this is nicer visually. 
        // TODO: Get notified when the scroll ends and update layout then.
        this._beaconSub = subscribeTimeout(() => {
            const widget = new BeaconWidget();
            widget.setPosition(data);
            this.editor.addContentWidget(widget);
            this.widgets.set('beacon', widget);
        }, 300);
    }
    hideBeacon() {
        // If a beacon is queud for display, cancel the timeout
        if (this._beaconSub) {
            this._beaconSub.dispose();
        }
        const widget = this.widgets.get('beacon');
        if (!widget) {
            return;
        }
        this.editor.removeContentWidget(widget);
        this.widgets.delete('beacon');
    }
    _getOpenPartsDialogStep(data : any) {
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
    _getCreatePartStep(data : any) {
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
    _createPartShorthand(data : any) {
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
    matchTrigger(validation : any, event : any) {
        let { emitter } = validation;
        if (emitter.part) {
            emitter = this.getFromStore(PARTS_STORE, emitter.part);
        }
        return emitter === event.trigger.emitter &&
                validation.event === event.trigger.event;
    }
    matchPartChange(validation : any, event : any) {
        return this.matchProperty(validation, event);
    }
    matchPartTarget(validation : any, event : any) {
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
    matchProperty(validation : any, event : any) {
        // Split the properties paths
        let validationParts = validation.property.split('.'),
            eventParts = event.property.split('.');
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
        if (typeof validation.value !== 'undefined') {
            return this.matchValue(validation, event);
        }

        return true;
    }
    _processPart(part : any) {
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
            if (part.type) {
                return `${part.rawPart}#${part.type}`;
            }
            return part.rawPart;
        }
        return part;
    }
    matchValue(validation : any, event : any) {
        return validation.value === event.value;
    }
    matchTool(validation : any, event : any) {
        return validation.tool === event.tool;
    }
    matchAddPart(validation : any, event : { data : Part }) {
        // Check the type of the added part
        if (!this.matchPartType(validation, event.data)) {
            return false;
        }
        // If an id is provided, save the id of the added part
        if (validation.alias) {
            this.aliases.set(validation.alias, `part#${event.data.id}`);
        }
        return true;
    }
    matchPartType(validation : any, part : Part) {
        return validation.type === (part.constructor as any).type;
    }
    matchSettingsInteraction(validation : any, event : any) {
        return validation.setting === event.setting;
    }
    get done() {
        return this.stepIndex === this.steps.length - 1;
    }
    _getOpenFlyoutStep(data : any) {
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
    _getCreateBlockStep(data : any) {
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
    _getConnectBlockStep(data : any) {
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
    _getDropBlockStep(data : any) {
        const step = super._getDropBlockStep(data);
        return Object.assign(step, {
            banner: {
                text: data.dropCopy || 'Drop this block anywhere in your code space',
            },
        });
    }
    _changeInputShorthand(data : any) {
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
