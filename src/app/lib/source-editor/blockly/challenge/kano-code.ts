import BlocklyChallenge from './blockly.js';
import { Editor } from '../../../editor/editor.js';
import { BannerWidget, IBannerButton } from '../../../challenge/widget/banner.js';
import { BeaconWidget } from '../../../challenge/widget/beacon.js';
import { subscribeTimeout, IDisposable } from '@kano/common/index.js';
import { Part } from '../../../parts/part.js';
import { Tooltip } from '../../../widget/tooltip.js';
import { challengeStyles } from '../../../challenge/styles.js';
import '../../../challenge/components/kc-toolbox-entry-preview.js';
import '../../../challenge/components/kc-part-api-preview.js';
import { dataURI } from '@kano/icons-rendering/index.js';
import { DropdownFieldStepHelper } from './helpers/dropdown.js';

export interface IBannerIconProvider {
    getDomNode() : HTMLElement;
}

export class KanoCodeChallenge extends BlocklyChallenge {
    public editor : Editor;
    private _beaconSub? : IDisposable;
    private tooltips : Tooltip[] = [];
    public banner? : BannerWidget;
    public bannerButton? : IBannerButton;
    private bannerIconProvider? : IBannerIconProvider;
    public progress : number = 0;
    private stylesheet : HTMLStyleElement;
    constructor(editor : Editor) {
        super(editor);
        this.editor = editor;
        // Support Editor actions in challenges
        this.addValidation('add-part', this.matchAddPart);
        this.addValidation('running', this.matchValue);

        // Opposite actions and fallbacks
        this.addOppositeAction('add-part', 'close-parts', this._partsClosed);

        // Shorthand for quick part validation
        this.defineShorthand('create-part', this._createPartShorthand.bind(this));

        // Define the challenges widgets for each step through the challenge data
        this.defineBehavior('banner', this.displayBanner.bind(this), this.hideBanner.bind(this));
        this.defineBehavior('beacon', this.displayBeacon.bind(this), this.hideBeacon.bind(this));
        this.defineBehavior('tooltips', this.displayTooltips.bind(this), this.hideTooltips.bind(this));

        // Trigger challenge events on editor events
        this.editor.parts.onDidOpenAddParts(() => {
            this.triggerEvent('open-parts');
        });
        this.editor.parts.onDidAddPart((part) => {
            this.triggerEvent('add-part', part);
        });
        // Inject challenge styles into the editor
        this.stylesheet = document.createElement('style');
        this.stylesheet.textContent = challengeStyles.cssText;
        this.editor.domNode.shadowRoot!.appendChild(this.stylesheet);

        this.helpers.push(new DropdownFieldStepHelper());
    }
    /**
     * Parses the provided text, extract and replace eventual template values with preview widgets.
     * It is important to make sure each preview widget returns only one element for it to be displayed inline
     * If it returns more than one, marked.js will display it as a block
     * @param text Source text to be processed as rich content
     */
    protected processRichText(text : string) {
        return text.replace(/\${(.+)}/g, (m, g0) => {
            const result = this.editor.querySelector(g0);
            if (!result) {
                return m;
            }
            if (result.entry) {
                // Matches a toolbox entry
                return `
                    <kc-toolbox-entry-preview name="${result.entry.name}" color="${result.entry.colour}"></kc-toolbox-entry-preview>
                `;
            } else if (result.api && result.api.icon) {
                // Matches a part api
                return `
                    <kc-part-api-preview label="${result.api.label}" icon="${dataURI(result.api.icon)}"></kc-part-api-preview>
                `;
            }
            // Warn and return an empty string if not supported
            console.warn(`[CHALLENGE] selector '${g0}' does not match any markdown widget`);
            return '';
        });
    }
    /**
     * Displays a list of tooltips as content widgets of the editor
     * @param tooltips A list of tooltip data from a challenge step
     */
    protected displayTooltips(tooltips : any[]) {
        tooltips.forEach((tooltipData) => {
            // Create the tooltip widget and add it to the editor
            const tooltip = new Tooltip();
            this.editor.addContentWidget(tooltip);
            // Keep a reference to the widgets
            this.tooltips.push(tooltip);
            // Update tooltip's data
            if (tooltipData.text) {
                tooltip.setText(this.processRichText(tooltipData.text));
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
                tooltip.setTarget(target as HTMLElement);
            }
        });
    }
    /**
     * Remove the tooltips previously added
     */
    protected hideTooltips() {
        this.tooltips.forEach((tooltip) => {
            tooltip.close().then(() => {
                this.editor.removeContentWidget(tooltip);
                tooltip.dispose();
            });
        });
        this.tooltips.length = 0;
    }
    /**
     * Displays a banner as a content widget on top of the sourceEditor
     * @param data Banner data from a challenge step
     */
    protected displayBanner(data : any) {
        if (!this.banner) {
            this.banner = new BannerWidget();
            this.editor.addContentWidget(this.banner);
        }
        if (this.bannerButton) {
            this.bannerButton.dispose();
        }
        let text;
        let nextButton = false;
        if (typeof data === 'string') {
            text = data;
        } else if (typeof data.text === 'string') {
            text = data.text;
            nextButton = !!data.nextButton;
        }
        this.banner.setText(this.processRichText(text));
        this.banner.setProgress(this.stepIndex / (this.steps.length - 1));
        if (this.bannerIconProvider) {
            const domNode = this.bannerIconProvider.getDomNode();
            this.banner.setIconNode(domNode);
        } else {
            this.banner.setIconNode(null);
        }
        if (nextButton) {
            this.bannerButton = this.banner.addButton('Next');
            this.bannerButton.onDidClick(() => this.nextStep());
        }
        this.widgets.set('banner', this.banner);
        this.banner.show();
        // TODO: play card_set here
    }
    /**
     * Removes a previously added banner
     */
    protected hideBanner() {
        if (!this.banner) {
            return;
        }
        this.banner.hide();
    }
    /**
     * Displays a beacon as a content widget on the editor
     * @param data Beacon data from a challenge step
     */
    protected displayBeacon(data : any) {
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
    /**
     * Removes a previously added beacon
     */
    protected hideBeacon() {
        // If a beacon is queued for display, cancel the timeout
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
            beacon: 'add-part-button',
            banner: data.openPartsCopy || 'Open the parts dialog',
        };
    }
    _getCreatePartStep(data : any) {
        return {
            validation: {
                'add-part': {
                    type: data.part,
                    alias: data.alias,
                },
            },
            beacon: `part.${data.part}`,
            tooltips: [{
                text: data.addPartCopy || `Click '${data.part}' to add it.`,
                position: 'top',
                target: 'add-part-menu',
            }],
        };
    }
    _createPartShorthand(data : any) {
        const openPartsDialogStep = this._getOpenPartsDialogStep(data);
        const createStep = this._getCreatePartStep(data);
        const steps = [openPartsDialogStep, createStep];
        return steps;
    }
    _partsClosed() {
        if (this.stepIndex > 0) {
            this.stepIndex -= 1;
        }
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
            this.registerAlias(validation.alias, `part#${event.data.id}`);
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
            banner: data.openFlyoutCopy || `Open the ${data.category} category`,
            beacon: `${data.category}:100,50`,
        });
    }
    _getCreateBlockStep(data : any) {
        const step = super._getCreateBlockStep(data);
        return Object.assign(step, {
            banner: data.grabBlockCopy || 'Grab this block',
            beacon: `${data.category}>flyout-block.${data.blockType}`,
        });
    }
    _getConnectBlockStep(data : any) {
        const step = super._getConnectBlockStep(data);
        return Object.assign(step, {
            banner: data.connectCopy || 'Connect to this block',
            beacon: data.connectTo,
        });
    }
    _getDropBlockStep(data : any) {
        const step = super._getDropBlockStep(data);
        return Object.assign(step, {
            banner: data.dropCopy || 'Drop this block anywhere in your code space',
        });
    }
    _changeInputShorthand(data : any) {
        const step = super._changeInputShorthand(data);
        Object.assign(step, {
            banner: data.bannerCopy || `Change this value to ${data.value}`,
            beacon: data.target,
        });
        return step;
    }
    /**
     * Defines the provider for the banner icon. This provider will define a DOM node tu use instead of the progress circle
     * @param provider A banner icon provider
     */
    setBannerIconProvider(provider : IBannerIconProvider) {
        this.bannerIconProvider = provider;
    }
    onEnd() {
        super.onEnd();
        // This is a end of challenge behavior
        if (this.banner) {
            // TODO: Set the end of challenge text
            this.banner.setText('This is the end of the challenge, I hope you were engaged');
            this.banner.setProgress(1);
            // Add a button if the challenge is configured to do so
            // if (this.options.end && this.options.end.showNextButton) {
            //     const button = this.engine.banner.addButton('Next Challenge', true);
            //     button.onDidClick(() => this._onDidRequestNextChallenge.fire());
            // }
            // Display the last banner
            this.banner.show();
        }
    }
    dispose() {
        super.dispose();
        this.tooltips.forEach((t) => {
            t.dispose();
            this.editor.removeContentWidget(t);
        });
        if (this.banner) {
            this.banner.dispose();
        }
        this.stylesheet.remove();
    }
}

export default KanoCodeChallenge;
