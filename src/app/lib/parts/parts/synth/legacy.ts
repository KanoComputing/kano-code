import { LegacyUtil } from '../../../legacy/util.js';

export function transformLegacySynth(app : any) {
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, 'synth', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#synth_set_volume"]`, (block) => {
                block.setAttribute('type', `${id}_volume_set`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#synth_play_frequency_for"]`, (block) => {
                block.setAttribute('type', `${id}_playFrequency`);
                LegacyUtil.renameValue(block, 'FREQUENCY', 'PITCH');
                LegacyUtil.renameValue(block, 'DURATION', 'FOR');
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#synth_start"]`, (block) => {
                block.setAttribute('type', `${id}_start`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#synth_stop"]`, (block) => {
                block.setAttribute('type', `${id}_stop`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#synth_set_frequency"]`, (block) => {
                block.setAttribute('type', `${id}_pitch_set`);
                LegacyUtil.renameValue(block, 'FREQUENCY', 'PITCH');
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#synth_set_wave"]`, (block) => {
                block.setAttribute('type', `${id}_wave_set`);
                const field = block.querySelector('field[name="WAVE"]');
                if (!field) {
                    return;
                }
                const value = block.querySelector('value');
                if (value) {
                    block.removeChild(value);
                }
                const newField = document.createElement('field');
                newField.setAttribute('name', 'WAVE');
                newField.textContent = field.textContent;
                block.appendChild(newField);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}