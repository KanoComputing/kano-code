import { LegacyUtil } from '../../../legacy/util.js';

export function transformLegacySpeaker(app : any) {
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        const ttsId = 'voice';
        let usesTTS = false;
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
            LegacyUtil.transformBlock(root, `block[type="${id}#say"]`, (block) => {
                usesTTS = true;
                block.setAttribute('type', `${ttsId}_say`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#speaker_sample"]`, (block) => {
                const setField = block.querySelector('field[name="SET"]');
                if (setField) {
                    setField.remove();
                }
                block.setAttribute('type', `${id}_getSample`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#speaker_set_volume"]`, (block) => {
                block.setAttribute('type', `${id}_volume_set`);
            });
        });
        if (usesTTS) {
            if (!app.parts) {
                app.parts = [];
            }
            app.parts.push({ type: 'voice', id: ttsId, name: 'Voice' });
        }
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}