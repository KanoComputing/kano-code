import { BlocklyTransformer } from '../../../legacy/loader.js';

export function legacyTransform(app : any) {
    if (app.source) {
        const root = BlocklyTransformer.getDOM(app.source);
        if (!root) {
            return;
        }
        const ids : string[] = app.parts.filter((part : any) => part.type === 'terminal').map((p : any) => p.id);
        ids.forEach((id) => {
            BlocklyTransformer.transformBlock(root, `block[type="${id}#toggle_on_off"]`, (block) => {
                block.setAttribute('type', `set_${id}_visible`);
                BlocklyTransformer.transformField(block, 'TOGGLE', (_, content) => {
                    return {
                        name: 'VISIBLE',
                        content: content === 'on' ? 'true' : 'false',
                    };
                });
            });
            BlocklyTransformer.transformBlock(root, `block[type="${id}#print_line"]`, (block) => {
                block.setAttribute('type', `${id}_printLine`);
                BlocklyTransformer.renameValue(block, 'MESSAGE', 'LINE');
            });
            BlocklyTransformer.transformBlock(root, `block[type="${id}#print"]`, (block) => {
                block.setAttribute('type', `${id}_print`);
                BlocklyTransformer.renameValue(block, 'MESSAGE', 'LINE');
            });
            BlocklyTransformer.transformBlock(root, `block[type="${id}#clear"]`, (block) => {
                block.setAttribute('type', `${id}_clear`);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}