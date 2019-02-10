import { LegacyUtil } from '../../../legacy/util.js';

export function legacyTransform(app : any) {
    if (app.source) {
        const root = LegacyUtil.getDOM(app.source);
        if (!root) {
            return;
        }
        LegacyUtil.forEachPart(app, 'terminal', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#toggle_on_off"]`, (block) => {
                block.setAttribute('type', `set_${id}_visible`);
                LegacyUtil.transformField(block, 'TOGGLE', (_, content) => {
                    return {
                        name: 'VISIBLE',
                        content: content === 'on' ? 'true' : 'false',
                    };
                });
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#print_line"]`, (block) => {
                block.setAttribute('type', `${id}_printLine`);
                LegacyUtil.renameValue(block, 'MESSAGE', 'LINE');
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#print"]`, (block) => {
                block.setAttribute('type', `${id}_print`);
                LegacyUtil.renameValue(block, 'MESSAGE', 'LINE');
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#clear"]`, (block) => {
                block.setAttribute('type', `${id}_clear`);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}