import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDOMPart } from '../dom/legacy.js';

export function transformLegacyTextInput(app : any) {
    transformLegacyDOMPart('text-input', app);
    if (app.source) {
        const root = LegacyUtil.getDOM(app.source);
        if (!root) {
            return;
        }
        LegacyUtil.forEachPart(app, 'text-input', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#input_text_set_value"]`, (block) => {
                LegacyUtil.renameValue(block, 'INPUT', 'VALUE');
                block.setAttribute('type', `set_${id}_value`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#input_text_get_value"]`, (block) => {
                block.setAttribute('type', `get_${id}_value`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#input_text_set_placeholder"]`, (block) => {
                block.setAttribute('type', `set_${id}_placeholder`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#input_text_get_placeholder"]`, (block) => {
                block.setAttribute('type', `get_${id}_placeholder`);
            });
            LegacyUtil.transformEventBlock(root, `${id}.input-keyup`, `${id}_onChange`, 'CALLBACK');
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}