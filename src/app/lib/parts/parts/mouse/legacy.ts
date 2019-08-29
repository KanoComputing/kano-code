import { LegacyUtil } from '../../../legacy/util.js';
import { getStickerIdForLegacy } from '../sticker/legacy.js';

export function transformLegacyMouse(app : any) {
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (!root) {
        return;
    }
    LegacyUtil.forEachPart(app, 'mouse', ({ id }) => {
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_set_cursor"] [type="assets_random_sticker_from"]`, (block) => {
            block.setAttribute('type', `${id}_random`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_set_cursor"] [type="assets_get_sticker"]`, (block) => {
            LegacyUtil.renameValue(block, 'PICTURE', 'STICKER');
            const setField = block.querySelector('[name="SET"]');
            const stickerField = block.querySelector('field[name="STICKER"]');
            if (stickerField && setField){
                const set = setField.innerHTML;
                const sticker = stickerField.innerHTML;
                let newSticker = getStickerIdForLegacy(set, sticker);
                stickerField.innerHTML = newSticker;
                setField.remove();
            }
            block.setAttribute('type', 'stamp_getImage');
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_x"]`, (block) => {
            block.setAttribute('type', `${id}_x_get`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_y"]`, (block) => {
            block.setAttribute('type', `${id}_y_get`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_speed_x"]`, (block) => {
            block.setAttribute('type', `${id}_dx_get`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_speed_y"]`, (block) => {
            block.setAttribute('type', `${id}_dy_get`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_set_cursor"]`, (block) => {
            block.setAttribute('type', `${id}_cursor_set`);
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#set_cursor"] [type="assets_random_sticker"]`, (block) => {
            block.setAttribute('type', 'stamp_random');
        });
        LegacyUtil.transformBlock(root, `block[type="${id}#mouse_event"]`, (block) => {
            const typeMap : { [K : string] : string } = {
                down: 'onDown',
                up: 'onUp',
                move: 'onMove',
            }
            const field = block.querySelector('field[name="TYPE"]');
            if (!field) {
                return;
            }
            const type = field.innerHTML;
            block.setAttribute('type', `${id}_${typeMap[type]}`);
            field.remove();
            LegacyUtil.renameStatement(block, 'DO', 'CALLBACK');
        });
        // TODO: Missing API
    });
    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}
