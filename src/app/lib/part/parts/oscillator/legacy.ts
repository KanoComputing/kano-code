import { LegacyUtil } from '../../../legacy/util.js';

export function transformLegacyOscillator(app : any) {
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (!root) {
        return;
    }
    LegacyUtil.forEachPart(app, 'oscillator', ({ id }) => {
        LegacyUtil.transformBlock(root, `block[type="${id}#osc_get_value"]`, (block) => {
            block.setAttribute('type', `get_${id}_value`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#osc_set_speed"]`, (block) => {
            block.setAttribute('type', `set_${id}_speed`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#osc_get_speed"]`, (block) => {
            block.setAttribute('type', `get_${id}_speed`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#osc_set_delay"]`, (block) => {
            block.setAttribute('type', `set_${id}_delay`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#osc_get_delay"]`, (block) => {
            block.setAttribute('type', `get_${id}_delay`);
        });
    });
    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}
