import { BlocklyTransformer } from '../../../legacy/loader.js';

export function transformLegacyDataPart(type : string, app : any) {
    if (!app.parts || !app.source) {
        return;
    }
    const ids : string[] = app.parts.filter((part : any) => part.type === type).map((p : any) => p.id);
    const root = BlocklyTransformer.getDOM(app.source);
    if (root) {
        ids.forEach(id => {
            BlocklyTransformer.transformBlock(root, `block[type="${id}#refresh"]`, (block) => {
                block.setAttribute('type', `${id}_refresh`);
            });
            BlocklyTransformer.transformBlock(root, 'block[type="part_event"]', (block) => {
                const field = block.querySelector('field[name="EVENT"]');
                if (!field) {
                    return;
                }
                // Depending on the contents of the field, change the block type
                if (field.textContent === `${id}.update`) {
                    block.setAttribute('type', `${id}_onUpdate`);
                    block.removeChild(field);
                    BlocklyTransformer.renameStatement(block, 'DO', 'CALLBACK');
                }
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}