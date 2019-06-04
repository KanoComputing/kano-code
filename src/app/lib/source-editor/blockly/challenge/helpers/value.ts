import { BlocklyStepHelper } from './blockly.js';
import { IStepData } from '../../../../creator/creator.js';
import { KanoCodeChallenge } from '../kano-code.js';
import { Field } from '@kano/kwc-blockly/blockly.js';

export class BlocklyValueStepHelper extends BlocklyStepHelper {
    test(challenge : KanoCodeChallenge, step : IStepData) {
        return super.test(challenge, step) && step.validation.blockly.value;
    }
    getField(challenge : KanoCodeChallenge, step : IStepData) : Field {
        const validation = step.validation.blockly.value;
        const result = challenge.editor.querySelector(validation.target);
        return result && result.field;
    }
}
