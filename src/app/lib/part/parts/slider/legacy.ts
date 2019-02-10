import { LegacyUtil } from '../../../legacy/util.js';

export function legacyTransform(app : any) {
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, 'slider', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#set_value"]`, (block) => {
                block.setAttribute('type', `set_${id}_value`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#get_value"]`, (block) => {
                block.setAttribute('type', `get_${id}_value`);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}