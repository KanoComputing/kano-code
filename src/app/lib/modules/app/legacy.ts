import { BlocklyTransformer } from '../../legacy/loader.js';

export function transformLegacy(app : any) {
    if (!app.source) {
        return;
    }
    const root = BlocklyTransformer.getDOM(app.source);
    if (!root) {
        return;
    }
    // Transform the event block
    BlocklyTransformer.transformBlock(root, 'block[type="part_event"]', (block) => {
        const field = block.querySelector('field[name="EVENT"]');
        if (!field) {
            return;
        }
        // Depending on the contents of the field, change the block type
        if (field.textContent === 'global.start') {
            block.setAttribute('type', 'app_onStart');
            block.removeChild(field);
            BlocklyTransformer.renameStatement(block, 'DO', 'CALLBACK');
        }
    });
    BlocklyTransformer.transformBlock(root, 'block[type="restart_code"]', (block) => {
        block.setAttribute('type', 'app_restart');
    });
    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}