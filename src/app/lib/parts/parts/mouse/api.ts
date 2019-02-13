import { MousePart } from './mouse.js';
import { IPartAPI } from '../../api.js';
import { svg } from '@kano/icons-rendering/index.js';
import { addFlashField, setupFlash } from '../../../plugins/flash.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import Editor from '../../../editor/editor.js';
import * as StickerBlocks from '../sticker/common.js';
import { StickerPart } from '../sticker/sticker.js';

const mouse = svg`<svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g><path d="M28.73,27.18l9.68-9.68-.58-.58a15.11,15.11,0,0,0-20.41-1Z"></path><path d="M29.46,29.78h0L19,40.3l7.77,7.77A14.94,14.94,0,1,0,47.86,26.94l-7.77-7.77Z"></path><path d="M26.87,29,15.72,17.64a15.11,15.11,0,0,0,1,20.41l.58.58Z"></path></g></svg>`;

export const MouseAPI : IPartAPI = {
    type: MousePart.type,
    label: 'Mouse',
    icon: mouse,
    color: '#ef5284',
    symbols: [{
        type: 'variable',
        name: 'x',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'y',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'dx',
        returnType: Number,
    }, {
        type: 'variable',
        name: 'dy',
        returnType: Number,
    },
    {
        type: 'variable',
        name: 'cursor',
        setter: true,
        getter: false,
        returnType: 'Sticker',
        default: StickerPart.defaultSticker,
        blockly: {
            shadow(def : string) {
                return `<shadow type="mouse_getSticker"><field name="STICKER">${StickerPart.defaultSticker}</field></shadow>`;
            },
        },
    },
    StickerBlocks.random,
    StickerBlocks.randomFrom,
    {
        type: 'function',
        name: 'onDown',
        verbose: 'on click',
        parameters: [{
            type: 'parameter',
            name: 'callback',
            verbose: '',
            returnType: Function,
        }],
        blockly: {
            postProcess(block : Block) {
                block.setNextStatement(false);
                block.setPreviousStatement(false);
                addFlashField(block);
            },
        },
    }, {
        type: 'function',
        name: 'onUp',
        verbose: 'on release',
        parameters: [{
            type: 'parameter',
            name: 'callback',
            verbose: '',
            returnType: Function,
        }],
        blockly: {
            postProcess(block : Block) {
                block.setNextStatement(false);
                block.setPreviousStatement(false);
                addFlashField(block);
            },
        },
    }, {
        type: 'function',
        name: 'onMove',
        verbose: 'on move',
        parameters: [{
            type: 'parameter',
            name: 'callback',
            verbose: '',
            returnType: Function,
        }],
        blockly: {
            postProcess(block : Block) {
                block.setNextStatement(false);
                block.setPreviousStatement(false);
                addFlashField(block);
            },
        },
    }, StickerBlocks.getter],
    onInstall(editor : Editor, part : MousePart) {
        if (!part.id) {
            return;
        }
        setupFlash(editor, part.id, part.core.down, 'onDown');
        setupFlash(editor, part.id, part.core.up, 'onUp');
        setupFlash(editor, part.id, part.core.move, 'onMove');
    },
};