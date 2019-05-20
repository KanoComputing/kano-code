import { FieldDropdown, WidgetDiv } from '@kano/kwc-blockly/blockly.js';
import { KanoCodeChallenge } from '../kano-code.js';
import { BlocklyValueStepHelper } from './value.js';
import { IStepData } from '../../../../creator/creator.js';
import { BeaconWidget } from '../../../../challenge/widget/beacon.js';
import { IDisposable } from '@kano/common/index.js';

class DropdownBeaconWidget extends BeaconWidget {
    getPosition() { return 'dropdown-target:0,50'; }
    getDomNode() {
        const node = super.getDomNode();
        node.style.zIndex = '200000';
        return node;
    }
}

export class DropdownFieldStepHelper extends BlocklyValueStepHelper {
    beacon : DropdownBeaconWidget|null = null;
    listener? : (e : any) => void;
    tagHandler? : IDisposable;
    test(challenge : KanoCodeChallenge, step : IStepData) {
        if (!super.test(challenge, step)) {
            return false;
        }
        const field = this.getField(challenge, step);
        return field && field.constructor === FieldDropdown;
    }
    setupBeacon(challenge : KanoCodeChallenge) {
        if (!this.beacon) {
            this.beacon = new DropdownBeaconWidget();
            challenge.editor.addContentWidget(this.beacon);
            const engineBeacon = challenge.widgets.get('beacon');
            if (engineBeacon) {
                const node = engineBeacon.getDomNode();
                node.style.opacity = '0';
            }
        }
    }
    removeBeacon(challenge : KanoCodeChallenge) {
        if (this.beacon) {
            challenge.editor.removeContentWidget(this.beacon);
            this.beacon = null;
            const engineBeacon = challenge.widgets.get('beacon');
            if (engineBeacon) {
                const node = engineBeacon.getDomNode();
                node.style.opacity = '';
            }
        }
    }
    enter(challenge : KanoCodeChallenge, step : IStepData) {
        const field = this.getField(challenge, step) as FieldDropdown;
        const options = field.getOptions();
        const targetIndex = options.findIndex(([, value]) => value === step.validation.blockly.value.value);
        if (!challenge.workspace) {
            return;
        }
        this.tagHandler = challenge.editor.queryEngine.registerTagHandler('dropdown-target', () => {
            return {
                getHTMLElement() {
                    const items = [...WidgetDiv.DIV.querySelectorAll('.goog-menuitem')];
                    const item = items[targetIndex] as HTMLElement;
                    if (!item) {
                        throw new Error('Could not find dropdown target');
                    }
                    return item;
                },
                getId() { return 'dropdown-target'; }
            };
        });
        // Listen to changes in the editor. For each change, add or remove the beacon
        this.listener = (e : any) => {
            const items = [...WidgetDiv.DIV.querySelectorAll('.goog-menuitem')];
            const item = items[targetIndex];
            if (item) {
                this.setupBeacon(challenge);
            } else {
                this.removeBeacon(challenge);
            }
        };
        challenge.workspace.addChangeListener(this.listener);
    }
    leave(challenge : KanoCodeChallenge, step : IStepData) {
        if (this.listener && challenge.workspace) {
            challenge.workspace.removeChangeListener(this.listener);
        }
        if (this.beacon) {
            challenge.editor.removeContentWidget(this.beacon);
            this.beacon = null;
        }
        if (this.tagHandler) {
            this.tagHandler.dispose();
        }
    }
}