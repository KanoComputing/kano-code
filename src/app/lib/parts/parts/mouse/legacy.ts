import { LegacyUtil } from '../../../legacy/util.js';

export function transformLegacyMouse(app : any) {
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (!root) {
        return;
    }
    LegacyUtil.forEachPart(app, 'mouse', ({ id }) => {
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_x"]`, (block) => {
            block.setAttribute('type', `${id}_x_get`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_y"]`, (block) => {
            block.setAttribute('type', `${id}_y_get`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_speed_x"]`, (block) => {
            block.setAttribute('type', `${id}_dx_get`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_speed_y"]`, (block) => {
            block.setAttribute('type', `${id}_dy_get`);
        });
        // TODO: Missing API
    });
    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}
