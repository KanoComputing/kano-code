import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDOMPart } from '../dom/legacy.js';

export function transformLegacy(app : any) {
    transformLegacyDOMPart('button', app);
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, 'button', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#set_label"]`, (block) => {
                block.setAttribute('type', `set_${id}_label`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#get_label"]`, (block) => {
                block.setAttribute('type', `get_${id}_label`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#set_background_colour"]`, (block) => {
                block.setAttribute('type', `set_${id}_background`);
                LegacyUtil.renameValue(block, 'COLOUR', 'BACKGROUND');
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#set_text_colour"]`, (block) => {
                block.setAttribute('type', `set_${id}_color`);
                LegacyUtil.renameValue(block, 'COLOUR', 'COLOR');
            });
            LegacyUtil.transformEventBlock(root, `${id}.clicked`, `${id}_onClick`, 'CALLBACK');
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}