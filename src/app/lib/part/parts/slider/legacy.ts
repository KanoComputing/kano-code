import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDOMPart } from '../dom/legacy.js';

export function transformLegacySlider(app : any) {
    transformLegacyDOMPart('slider', app);
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
            LegacyUtil.transformEventBlock(root, `${id}.update`, `${id}_onChange`, 'CALLBACK');
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}