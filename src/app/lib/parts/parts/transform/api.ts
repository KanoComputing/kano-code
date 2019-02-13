import { IMetaDefinition } from '../../../meta-api/module.js';

export const TransformAPI : IMetaDefinition[] = [
    {
        type: 'function',
        name: 'moveAlong',
        verbose: 'move',
        parameters: [{
            type: 'parameter',
            name: 'distance',
            returnType: Number,
            default: 0,
        }],
    },
    {
        type: 'function',
        name: 'turn',
        verbose: 'turn',
        parameters: [{
            type: 'parameter',
            name: 'type',
            returnType: 'Enum',
            enum: [
                ['\u21BB', 'clockwise'],
                ['\u21BA', 'counterclockwise'],
                ['to', 'to'],
            ],
        }, {
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
    {
        type: 'variable',
        name: 'opacity',
        returnType: Number,
        default: 100,
        setter: true,
    },
    {
        type: 'variable',
        name: 'x',
        returnType: Number,
    },
    {
        type: 'variable',
        name: 'y',
        returnType: Number,
    },
    {
        type: 'variable',
        name: 'scale',
        returnType: Number,
    },
    {
        type: 'variable',
        name: 'rotation',
        returnType: Number,
    },
];
