import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDOMPart } from '../dom/legacy.js';

export function transformLegacyText(app : any) {
    transformLegacyDOMPart('text', app);
    if (app.source) {
        const root = LegacyUtil.getDOM(app.source);
        if (!root) {
            return;
        }
        LegacyUtil.forEachPart(app, 'text', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#set_value"]`, (block) => {
                LegacyUtil.renameValue(block, 'INPUT', 'VALUE');
                block.setAttribute('type', `${id}_value_set`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#get_text"]`, (block) => {
                block.setAttribute('type', `${id}_value_set`);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}