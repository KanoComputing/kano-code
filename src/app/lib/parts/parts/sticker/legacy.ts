import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDOMPart } from '../dom/legacy.js';

export const stickersMap : { [K : string] : string } = {
    'mask-smile': 'smile',
    'mask-cool': 'cool',
    'mask-grin': 'grin',
    'mask-laughcry': 'laughcry',
    'mask-meh': 'meh',
    'mask-rolleyes': 'rolleyes',
    'mask-blank': 'blank',
    'mask-sleep': 'sleep',
    'food-burger': 'burger',
    'animal-duck': 'duck',
};

export function transformLegacySticker(app : any) {
    transformLegacyDOMPart('sticker', app);
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, 'sticker', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#set_sticker"] [type="assets_get_sticker"]`, (block) => {
                LegacyUtil.renameValue(block, 'PICTURE', 'STICKER');
                const setField = block.querySelector('[name="SET"]');
                if (setField) {
                    setField.remove();
                }
                const stickerField = block.querySelector('field[name="STICKER"]');
                if (stickerField){
                    stickerField.innerHTML = stickersMap[stickerField.innerHTML];
                }
                block.setAttribute('type', 'stamp_getImage');
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#set_sticker"]`, (block) => {
                LegacyUtil.renameValue(block, 'PICTURE', 'IMAGE');
                block.setAttribute('type', `${id}_image_set`);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}