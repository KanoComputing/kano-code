import { BlocklyTransformer } from '../../../legacy/loader.js';

export function legacyTransform(app : any) {
    if (app.source) {
        const root = BlocklyTransformer.getDOM(app.source);
        if (root) {
            BlocklyTransformer.transformBlock(root, 'block[type$="toggle_on_off"]', (block) => {
                block.setAttribute('type', block.getAttribute('type')!.replace(/(.+)#(.+)/, 'set_$1_visible'));
                BlocklyTransformer.transformField(block, 'TOGGLE', (_, content) => {
                    return {
                        name: 'VISIBLE',
                        content: content === 'on' ? 'true' : 'false',
                    };
                });
            });
            BlocklyTransformer.transformBlock(root, 'block[type$="print_line"]', (block) => {
                block.setAttribute('type', block.getAttribute('type')!.replace(/(.+)#(.+)/, '$1_printLine'));
                BlocklyTransformer.renameValue(block, 'MESSAGE', 'LINE');
            });
            BlocklyTransformer.transformBlock(root, 'block[type$="print"]', (block) => {
                block.setAttribute('type', block.getAttribute('type')!.replace(/(.+)#(.+)/, '$1_print'));
                BlocklyTransformer.renameValue(block, 'MESSAGE', 'LINE');
            });
            BlocklyTransformer.transformBlock(root, 'block[type$="clear"]', (block) => {
                block.setAttribute('type', block.getAttribute('type')!.replace(/(.+)#(.+)/, '$1_clear'));
            });
            const serializer = new XMLSerializer();
            app.source = serializer.serializeToString(root);
        }
    }
}