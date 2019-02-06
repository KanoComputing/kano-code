import { registerTypeSerializer, defaultSerializer } from '../../component.js';

export const Wave = Symbol();

registerTypeSerializer(Wave, defaultSerializer);
