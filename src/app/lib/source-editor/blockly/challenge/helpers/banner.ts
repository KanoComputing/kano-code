import { IStepHelper } from '../../../../challenge/helper.js';
import { IStepData } from '../../../../creator/creator.js';
import { KanoCodeChallenge } from '../kano-code.js';

export class BannerHelper implements IStepHelper {
    enter(challenge : KanoCodeChallenge, step : IStepData): void {
        challenge.editor.setInputDisabled(true);
    }
    leave(challenge : KanoCodeChallenge, step : IStepData) : void {
        challenge.editor.setInputDisabled(false);
    }
    test(challenge : KanoCodeChallenge, step : IStepData) {
        return step.banner && step.banner.disableInput;
    }
}
