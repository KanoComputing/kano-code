import { KanoCodeChallenge } from './kano-code.js';
import { registerChallengeEngine } from '../../../challenge/index.js';

registerChallengeEngine('blockly', KanoCodeChallenge);
