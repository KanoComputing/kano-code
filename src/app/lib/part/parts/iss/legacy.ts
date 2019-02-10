import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDataPart } from '../data/legacy.js';

export function transformLegacy(app : any) {
    transformLegacyDataPart('iss', app);
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, 'iss', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#get_value"]`, (block) => {
                const keyField = block.querySelector('field[name="KEY"]');
                if (!keyField) {
                    return;
                }
                if (keyField.textContent === 'latitude') {
                    block.setAttribute('type', `get_${id}_latitude`);
                } else if (keyField.textContent === 'longitude') {
                    block.setAttribute('type', `get_${id}_longitude`);
                }
                block.removeChild(keyField);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}