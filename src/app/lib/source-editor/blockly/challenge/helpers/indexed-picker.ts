import { WidgetDiv } from '@kano/kwc-blockly/blockly.js';
import { FieldPicker } from '../../../../blockly/fields/field-picker.js'
import { StampsField } from '../../../../blockly/fields/stamps-field.js'
import { KanoCodeChallenge } from '../kano-code.js';
import { BlocklyValueStepHelper } from './value.js';
import { IStepData } from '../../../../creator/creator.js';
import { BeaconWidget } from '../../../../challenge/widget/beacon.js';
import { IDisposable } from '@kano/common/index.js';
import { IItemData, IItemDataResource } from '../../../../blockly/fields/stamps-field.js';
import { throttle } from '../../../../decorators.js';
import { FieldSample } from '../../../../parts/parts/speaker/blockly/field-sample.js';

class IndexedPickerBeaconWidget extends BeaconWidget {
    getPosition() { return 'picker-target:0,50'; }
    getDomNode() {
        const node = super.getDomNode();
        node.style.zIndex = '200000';
        return node;
    }
}

export class IndexedPickerFieldStepHelper extends BlocklyValueStepHelper {
    beacon: IndexedPickerBeaconWidget | null = null;
    listener?: (e: any) => void;
    tagHandler?: IDisposable;

    testCase(challenge: KanoCodeChallenge, step: IStepData) {
        const field = this.getField(challenge, step);
        return field && (field.constructor === StampsField || field.constructor === FieldSample);
    }

    test(challenge: KanoCodeChallenge, step: IStepData) {
        if (!super.test(challenge, step)) {
            return false;
        }
        return this.testCase(challenge, step);
    }
    setupBeacon(challenge: KanoCodeChallenge) {
        if (!this.beacon) {
            this.beacon = new IndexedPickerBeaconWidget();
            challenge.editor.addContentWidget(this.beacon);
            const engineBeacon = challenge.widgets.get('beacon');
            if (engineBeacon) {
                const node = engineBeacon.getDomNode();
                node.style.opacity = '0';
            }
        }
    }
    removeBeacon(challenge: KanoCodeChallenge) {
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
    enter(challenge: KanoCodeChallenge, step: IStepData) {
        const field = this.getField(challenge, step) as FieldPicker;
        const options: IItemData[] = field.getOptions();

        let targetItems : IItemDataResource[] = []
        Object.values(options).forEach((item) => {
            item.resources.forEach(el => targetItems.push(el))
        });

        if (!challenge.workspace) {
            return;
        }
        const getItem = this.getItem.bind(this);
        this.tagHandler = challenge.editor.queryEngine.registerTagHandler('picker-target', () => {
            return {
                getHTMLElement() {
                    const item = getItem(step.validation.blockly.value.value, targetItems);
                    if (!item) {
                        return field.getSvgRoot();
                    }
                    item.scrollIntoView({ behavior: 'smooth' });
                    return item;
                },
                getId() { return 'picker-target'; }
            };
        });
        // Listen to changes in the editor. For each change, add or remove the beacon
        this.listener = (e: any) => {
            const scrollingEl : HTMLElement = this.getScrollingElement() as HTMLElement;
            if (!scrollingEl) {
                return;
            }
            scrollingEl.addEventListener('scroll', (event: Event) => this.onScroll(event, challenge));
            const item = this.getItem(step.validation.blockly.value.value, targetItems);
            if (item) {
                this.setupBeacon(challenge);
            } else {
                this.removeBeacon(challenge);
            }
        };
        challenge.workspace.addChangeListener(this.listener);
    }
    leave(challenge: KanoCodeChallenge, step: IStepData) {
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

    getItem(id: string, targetItems: IItemDataResource[]) {
        const shadow = this.getShadowElement();
        if (!shadow) {
            return;
        }
        const items = shadow.querySelectorAll('.item');
        const item = Array.from(items).find(item => item.id === id) as HTMLElement;
        return item;
    }

    getIdFromValue(value: string, targetItems: IItemDataResource[]) {
        const item = targetItems.find((el: IItemDataResource) => value === el.label);
        let id = '';
        if (item && item.id) {
            id = item.id;
        }
        return id;
    }

    getShadowElement() {
        if (!WidgetDiv || !WidgetDiv.DIV || !WidgetDiv.DIV.firstChild) {
            return;
        }
        const picker = WidgetDiv.DIV.firstChild as HTMLElement;
        const shadow = picker.shadowRoot;
        if (!shadow) {
            return;
        }
        return shadow;
    }

    getScrollingElement() {
        const shadow = this.getShadowElement();
        if (!shadow) {
            return;
        }
        const scrollingEl = shadow.querySelector('.items');
        return scrollingEl;
    }

    @throttle(500)
    protected onScroll(e: Event, challenge: KanoCodeChallenge) {
        if (challenge && challenge.workspace) {
            challenge.workspace.fireChangeListener(e);
        }
    }

}