import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDOMPart } from '../dom/legacy.js';

export function transformLegacySticker(app : any) {
    transformLegacyDOMPart('sticker', app);
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, 'speaker', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#speaker_playback_rate"]`, (block) => {
                LegacyUtil.renameValue(block, 'RATE', 'PITCH');
                block.setAttribute('type', `${id}_pitch_set`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#speaker_play"]`, (block) => {
                block.setAttribute('type', `${id}_play`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#speaker_loop"]`, (block) => {
                block.setAttribute('type', `${id}_loop`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#speaker_stop"]`, (block) => {
                block.setAttribute('type', `${id}_stop`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#speaker_sample"]`, (block) => {
                block.setAttribute('type', `${id}_getSample`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#speaker_set_volume"]`, (block) => {
                block.setAttribute('type', `${id}_volume_set`);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}