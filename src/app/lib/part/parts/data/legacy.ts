import { LegacyUtil } from '../../../legacy/util.js';

export function transformLegacyDataPart(type : string, app : any) {
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, type, ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#refresh"]`, (block) => {
                block.setAttribute('type', `${id}_refresh`);
            });
            LegacyUtil.transformEventBlock(root, `${id}.update`, `${id}_onUpdate`, 'CALLBACK');
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}