import { ChallengeBase } from '../challenge/base.js';

export interface IBriefingSample {
    img : string;
    description : string;
    link : string;
}

export interface IBriefingData {
    id : string;
    samples : IBriefingSample[];
    instruction? : string;
}

export class Briefing extends ChallengeBase {
    public data? : IBriefingData;
    start() {
        if (!this.editor.injected) {
            throw new Error('Could not start briefing: The editor was not injected');
        }
        if (!this.data) {
            throw new Error('Could not start challenge: No data was provided');
        }
    }
    dispose() {}
}
