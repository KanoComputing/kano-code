import { MousePart } from './mouse.js';
import { IPartAPI } from '../../api.js';
import { svg } from '@kano/icons-rendering/index.js';
import { addFlashField, setupFlash } from '../../../plugins/flash/flash.js';
import { Block } from '@kano/kwc-blockly/blockly.js';
import { Editor } from '../../../editor/editor.js';
import { random, randomFrom } from '../../../modules/stamp/api.js';
import { StickerPart } from '../sticker/sticker.js';
import { _ } from '../../../i18n/index.js';

const mouse = svg`<svg viewBox="0 0 64 64" preserveAspectRatio="xMidYMid meet" focusable="false" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g><path d="M28.73,27.18l9.68-9.68-.58-.58a15.11,15.11,0,0,0-20.41-1Z"></path><path d="M29.46,29.78h0L19,40.3l7.77,7.77A14.94,14.94,0,1,0,47.86,26.94l-7.77-7.77Z"></path><path d="M26.87,29,15.72,17.64a15.11,15.11,0,0,0,1,20.41l.58.58Z"></path></g></svg>`;

export function MouseAPI(editor: Editor) : IPartAPI {
    return {
        type: MousePart.type,
        label: _('PART_MOUSE_LABEL', 'Mouse'),
        icon: mouse,
        color: '#ef5284',
        symbols: [{
            type: 'variable',
            name: 'x',
            verbose: _('PART_MOUSE_X', 'x'),
            returnType: Number,
        }, {
            type: 'variable',
            name: 'y',
            verbose: _('PART_MOUSE_Y', 'y'),
            returnType: Number,
        }, {
            type: 'variable',
            name: 'dx',
            verbose: _('PART_MOUSE_DX', 'speed x'),
            returnType: Number,
        }, {
            type: 'variable',
            name: 'dy',
            verbose: _('PART_MOUSE_DY', 'speed y'),
            returnType: Number,
        },
        {
            type: 'variable',
            name: 'cursor',
            verbose: _('PART_MOUSE_CURSOR', 'cursor'),
            setter: true,
            getter: false,
            returnType: 'Sticker',
            default: StickerPart.defaultSticker,
            blockly: {
                shadow() {
                    return `<shadow type="stamp_getImage"><field name="STICKER">${StickerPart.defaultSticker}</field></shadow>`;
                },
            },
        },
        random,
        randomFrom,
        {
            type: 'function',
            name: 'onDown',
            verbose: _('PART_MOUSE_ON_DOWN', 'on click'),
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
            verbose: _('PART_MOUSE_ON_UP', 'on release'),
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
            verbose: _('PART_MOUSE_ON_MOVE', 'on move'),
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
        }],
        onInstall(editor : Editor, part : MousePart) {
            if (!part.id) {
                return;
            }
            setupFlash(editor, part.id, part.core.down, 'onDown');
            setupFlash(editor, part.id, part.core.up, 'onUp');
            setupFlash(editor, part.id, part.core.move, 'onMove');
        },
    }
};