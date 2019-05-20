import { KanoCodeChallenge } from './kano-code.js';
import { registerChallengeEngine } from '../../../challenge/index.js';
// This imports all the UI elements the creator might register
export * from '../creator/helpers.js';

registerChallengeEngine('blockly', KanoCodeChallenge);
