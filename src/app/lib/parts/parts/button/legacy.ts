import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDOMPart } from '../dom/legacy.js';

export function transformLegacyButton(app : any) {
    transformLegacyDOMPart('button', app);
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, 'button', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#set_label"]`, (block) => {
                block.setAttribute('type', `${id}_label_set`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#get_label"]`, (block) => {
                block.setAttribute('type', `${id}_label_get`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#set_background_colour"]`, (block) => {
                block.setAttribute('type', `${id}_background_set`);
                LegacyUtil.renameValue(block, 'COLOUR', 'BACKGROUND');
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#set_text_colour"]`, (block) => {
                block.setAttribute('type', `${id}_color_set`);
                LegacyUtil.renameValue(block, 'COLOUR', 'COLOR');
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}