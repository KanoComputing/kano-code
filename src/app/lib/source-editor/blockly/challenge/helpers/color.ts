import { FieldColour, Blockly } from '@kano/kwc-blockly/blockly.js';
import { KanoCodeChallenge } from '../kano-code.js';
import { BlocklyValueStepHelper } from './value.js';
import { IStepData } from '../../../../creator/creator.js';

export class ColorFieldStepHelper extends BlocklyValueStepHelper {
    test(challenge : KanoCodeChallenge, step : IStepData) {
        if (!super.test(challenge, step)) {
            return false;
        }
        const field = this.getField(challenge, step);
        return field instanceof FieldColour;
    }
    enter(challenge : KanoCodeChallenge, step : IStepData) {
        const field = this.getField(challenge, step) as FieldColour;
        const block = field.sourceBlock_;
        if (!challenge.workspace) {
            return;
        }
        challenge.workspace.addChangeListener((e) => {
            if (e.type !== Blockly.Events.UI || e.blockId !== block.id) {
                return;
            }
            // TODO: Do something with this or remove this helper
        });
    }
    leave() {}
}