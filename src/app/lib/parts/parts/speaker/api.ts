import { SpeakerAPIFactory } from './factory.js';
import { SpeakerPart } from './speaker.js';

export const SpeakerAPI = SpeakerAPIFactory(SpeakerPart);
