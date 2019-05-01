import { Editor } from '../editor/editor.js';
import { IChallengeData, Challenge, IChallengeOptions } from './challenge.js';

export * from './challenge.js';

export function createChallenge(editor : Editor, data : IChallengeData, options : IChallengeOptions) {
    return new Challenge(editor, data, options);
}
