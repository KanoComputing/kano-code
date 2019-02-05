import { IMetaDefinition } from '../../../meta-api/module.js';

export const TransformAPI : IMetaDefinition[] = [
    {
        type: 'function',
        name: 'moveAlong',
        verbose: 'move',
        parameters: [{
            type: 'pixels',
            name: 'distance',
            returnType: Number,
            default: 0,
        }],
    },
    {
        type: 'function',
        name: 'setRotation',
        verbose: 'turn',
        parameters: [{
            type: 'parameter',
            name: 'rotation',
            returnType: Number,
            default: 0,
        }],
    },
    {
        type: 'function',
        name: 'setScale',
        verbose: 'set size to',
        parameters: [{
            type: 'parameter',
            name: 'scale',
            returnType: Number,
            default: 100,
        }],
    },
    {
        type: 'function',
        name: 'moveTo',
        verbose: 'move to',
        parameters: [{
            type: 'parameter',
            name: 'x',
            returnType: Number,
            default: 0,
        }, {
            type: 'parameter',
            name: 'y',
            returnType: Number,
            default: 0,
        }],
    },
];
