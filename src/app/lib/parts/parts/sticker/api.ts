import { sticker } from '@kano/icons/parts.js';
import { IPartAPI } from '../../api.js';
import { StickerPart } from './sticker.js';
import { TransformAPI, onTransformInstall } from '../transform/api.js';
import { random, randomFrom } from '../../../modules/stamp/common.js';
import { Editor } from '../../../editor/editor.js';
import { _ } from '../../../i18n/index.js';

export const StickerAPI : IPartAPI = {
    type: StickerPart.type,
    label: _('PART_STICKER_LABEL', 'Sticker'),
    icon: sticker,
    color: '#00c7b6',
    symbols: [{
        type: 'variable',
        name: 'image',
        verbose: _('PART_STICKER_IMAGE', 'image'),
        setter: true,
        getter: false,
        returnType: 'Sticker',
        default: StickerPart.defaultSticker,
        blockly: {
            shadow() {
                return `<shadow type="stamp_getImage"><field name="STICKER">${StickerPart.defaultSticker}</field></shadow>`;
            },
        },
    }, random, randomFrom, ...TransformAPI],
    onInstall(editor : Editor, part : StickerPart) {
        onTransformInstall(editor, part);
    },
};
