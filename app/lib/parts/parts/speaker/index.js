import { config } from '../../../../scripts/config/config.js';
import SpeakerFactory from './factory.js';
import { SamplesGenerator, SamplesDirGenerator } from './samples.js';

const root = config.KANO_CODE_URL;

const samples = SamplesGenerator(root);
const samplesDir = SamplesDirGenerator(root);

const speaker = SpeakerFactory(root, samples, samplesDir, 'Drum Machine');

export default speaker;
