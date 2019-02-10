import { LegacyUtil } from '../../../legacy/util.js';

export function legacyTransform(app : any) {
    if (app.source) {
        const root = LegacyUtil.getDOM(app.source);
        if (!root) {
            return;
        }
        LegacyUtil.forEachPart(app, 'text', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#set_value"]`, (block) => {
                LegacyUtil.renameValue(block, 'INPUT', 'VALUE');
                block.setAttribute('type', `set_${id}_value`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#get_text"]`, (block) => {
                block.setAttribute('type', `get_${id}_value`);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}