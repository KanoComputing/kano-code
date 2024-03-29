/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

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
    title? : string;
    nextChallengeButton? : string | Boolean;
    icon? : {
        getDomNode() : HTMLElement;
    };
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
