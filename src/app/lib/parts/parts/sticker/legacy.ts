import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDOMPart } from '../dom/legacy.js';
export function transformLegacySticker(app) {
    transformLegacyDOMPart('sticker', app);
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, 'sticker', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#set_sticker"]`, (block) => {
                block.setAttribute('type', `${id}_cursor_set`);
            });
            LegacyUtil.transformBlock(root, `shadow[type="${id}#assets_get_sticker"]`, (shadow) => {
                shadow.setAttribute('type', `${id}_image_set`);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}
//# sourceMappingURL=legacy.js.map