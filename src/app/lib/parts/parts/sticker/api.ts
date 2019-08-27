import { sticker } from '@kano/icons/parts.js';
import { IPartAPI } from '../../api.js';
import { StickerPart } from './sticker.js';
import { TransformAPI, onTransformInstall } from '../transform/api.js';
import { random } from '../../../modules/stamp/common.js';
import { Editor } from '../../../editor/editor.js';
import { _ } from '../../../i18n/index.js';

export function StickerAPI(editor: Editor) : IPartAPI {
    const stickers = editor.output.resources.get('stickers');
    const defaultSticker = stickers ? stickers.default : '';
    return {
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
            default: defaultSticker,
            blockly: {
                shadow(defaultValue : string) {
                    return `<shadow type="stamp_getImage"><field name="STICKER">${defaultValue}</field></shadow>`;
                },
            },
        }, random(editor), ...TransformAPI],
        onInstall(editor : Editor, part : StickerPart) {
            onTransformInstall(editor, part);
        },
    }
};
