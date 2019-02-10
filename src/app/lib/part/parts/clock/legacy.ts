import { LegacyUtil } from '../../../legacy/util.js';

export function transformLegacyClock(app : any) {
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (!root) {
        return;
    }
    LegacyUtil.forEachPart(app, 'clock', ({ id }) => {
        LegacyUtil.transformBlock(root, `block[type="${id}#get_time"]`, (block) => {
            block.setAttribute('type', `${id}_getCurrent`);
            LegacyUtil.transformField(block, 'FIELD', (name, content) => {
                return {
                    name: 'KEY',
                    content: content || '',
                };
            });
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#get_formatted_time"]`, (block) => {
            block.setAttribute('type', `${id}_get`);
            LegacyUtil.transformField(block, 'FIELD', (name, content) => {
                return {
                    name: 'KEY',
                    content: content || '',
                };
            });
        });
    });
    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}
