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
            block.setAttribute('type', `${id}_value_get`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#osc_set_speed"]`, (block) => {
            block.setAttribute('type', `${id}_speed_set`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#osc_get_speed"]`, (block) => {
            block.setAttribute('type', `${id}_speed_get`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#osc_set_delay"]`, (block) => {
            block.setAttribute('type', `${id}_delay_set`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#osc_get_delay"]`, (block) => {
            block.setAttribute('type', `${id}_delay_get`);
        });
    });
    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}
