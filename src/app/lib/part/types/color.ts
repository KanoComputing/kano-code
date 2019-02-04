import { registerTypeSerializer, defaultSerializer } from '../component.js';

export const Color = Symbol();

registerTypeSerializer(Color, defaultSerializer);
