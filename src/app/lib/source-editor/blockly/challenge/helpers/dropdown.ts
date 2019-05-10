import { Blockly, FieldDropdown, WidgetDiv } from '@kano/kwc-blockly/blockly.js';
import { KanoCodeChallenge } from '../kano-code.js';
import { BlocklyValueStepHelper } from './value.js';
import { IStepData } from '../../../../creator/creator.js';
import { BeaconWidget } from '../../../../challenge/widget/beacon.js';

class DropdownBeaconWidget extends BeaconWidget {
    targetIndex : number = -1;
    getPosition() { return null; }
    setTargetIndex(index : number) {
        this.targetIndex = index;
    }
    layout() {
        const items = [...WidgetDiv.DIV.querySelectorAll('.goog-menuitem')];
        const item = items[this.targetIndex];
        if (!item) {
            return;
        }
        const rect = item.getBoundingClientRect();
        const domNode = this.getDomNode();
        domNode.style.left = `${rect.left}px`;
        domNode.style.top = `${rect.top}px`;
        domNode.style.zIndex = '200000';
    }
}

export class DropdownFieldStepHelper extends BlocklyValueStepHelper {
    beacon? : DropdownBeaconWidget;
    test(challenge : KanoCodeChallenge, step : IStepData) {
        if (!super.test(challenge, step)) {
            return false;
        }
        const field = this.getField(challenge, step);
        return field instanceof FieldDropdown;
    }
    enter(challenge : KanoCodeChallenge, step : IStepData) {
        const field = this.getField(challenge, step) as FieldDropdown;
        const block = field.sourceBlock_;
        const options = field.getOptions();
        const targetIndex = options.findIndex(([, value]) => value === step.validation.blockly.value.value);
        challenge.workspace.addChangeListener((e) => {
            console.log(e);
            if (e.type !== Blockly.Events.UI || e.blockId !== block.id) {
                return;
            }
            const items = [...WidgetDiv.DIV.querySelectorAll('.goog-menuitem')];
            const item = items[targetIndex];
            if (!item) {
                return;
            }
            if (!this.beacon) {
                this.beacon = new DropdownBeaconWidget();
                this.beacon.setTargetIndex(targetIndex);
                challenge.editor.addContentWidget(this.beacon!);
            } else {
                this.beacon.setTargetIndex(targetIndex);
                this.beacon.layout();
            }
        });
    }
    leave(challenge : KanoCodeChallenge, step : IStepData) {
        if (this.beacon) {
            challenge.editor.removeContentWidget(this.beacon);
        }
    }
}