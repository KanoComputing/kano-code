import { LegacyUtil } from '../../legacy/util.js';

export function transformLegacy(app : any) {
    if (!app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (!root) {
        return;
    }
    // Transform the event block
    LegacyUtil.transformBlock(root, 'block[type="part_event"]', (block) => {
        const field = block.querySelector('field[name="EVENT"]');
        if (!field) {
            return;
        }
        // Depending on the contents of the field, change the block type
        if (field.textContent === 'global.start') {
            block.setAttribute('type', 'app_onStart');
            block.removeChild(field);
            LegacyUtil.renameStatement(block, 'DO', 'CALLBACK');
        }
    });
    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}