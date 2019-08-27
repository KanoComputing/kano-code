import { IMetaDefinition } from '../../meta-api/module.js';
import { Editor } from '../../editor/editor.js';
import { _ } from '../../i18n/index.js';

export function random(editor : Editor) : IMetaDefinition {
    const stickers = editor.output.resources.get('stickers');
    let stickerEnum : [string, string][] = [];
    if (stickers) {
        stickerEnum = stickers.categoryEnum;
    }
    stickerEnum.unshift([_('ALL', 'All'), 'all']);
    return {
        type: 'function',
        name: 'random',
        verbose: _('PART_STICKER_RANDOM_FROM', 'random from'),
        returnType: 'Sticker',
        parameters: [{
            type: 'parameter',
            name: 'set',
            verbose: '',
            returnType: 'Enum',
            enum: stickerEnum,
        }]
    }
}
