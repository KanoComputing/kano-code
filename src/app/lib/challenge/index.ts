import { Editor } from '../editor/editor.js';
import { IChallengeData, Challenge } from './challenge.js';

export * from './challenge.js';

export function createChallenge(editor : Editor, data : IChallengeData) {
    return new Challenge(editor, data);
}
