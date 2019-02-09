import { BlocklyTransformer } from '../../legacy/loader.js';

export function transformLegacy(app : any) {
    if (!app.source) {
        return;
    }
    const root = BlocklyTransformer.getDOM(app.source);
    if (!root) {
        return;
    }

    BlocklyTransformer.transformBlock(root, 'block[type^="normal#"]', (block) => {
        block.setAttribute('type', block.getAttribute('type')!.replace('normal#', 'draw_'));
    });

    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}