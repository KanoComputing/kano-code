import { BlocklyTransformer } from '../../../legacy/loader.js';

export function legacyTransform(app : any) {
    if (app.source) {
        const root = BlocklyTransformer.getDOM(app.source);
        if (!root) {
            return;
        }
        const ids : string[] = app.parts.filter((part : any) => part.type === 'text').map((p : any) => p.id);
        ids.forEach((id) => {
            BlocklyTransformer.transformBlock(root, `block[type="${id}#set_value"]`, (block) => {
                BlocklyTransformer.renameValue(block, 'INPUT', 'VALUE');
                block.setAttribute('type', `set_${id}_value`);
            });
            BlocklyTransformer.transformBlock(root, `block[type="${id}#get_text"]`, (block) => {
                block.setAttribute('type', `get_${id}_value`);
            });
        });
        console.log(root);
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}