import { LegacyUtil } from '../../legacy/util.js';

export function transformLegacy(app : any) {
    if (!app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (!root) {
        return;
    }

    LegacyUtil.transformBlock(root, 'block[type^="normal#"]', (block) => {
        block.setAttribute('type', block.getAttribute('type')!.replace('normal#', 'draw_'));
    });

    function upscale(block : HTMLElement, fieldName : string, factor : number) {
        const field = block.querySelector(`value[name="${fieldName}"] field[name="NUM"]`);
        if (!field) {
            return;
        }
        const xVal = parseInt(field.innerHTML, 10);
        field.innerHTML = (xVal * factor).toString();
    }
    // TODO: This work could make legacy shares upscale to the new width and height
    const xS = 1;
    const yS = 1;

    LegacyUtil.transformBlock(root, '[type="draw_move_to"]', (block) => {
        upscale(block, 'X', xS);
        upscale(block, 'Y', yS);
    });
    LegacyUtil.transformBlock(root, '[type="draw_rectangle"]', (block) => {
        upscale(block, 'WIDTH', xS);
        upscale(block, 'HEIGHT', yS);
    });
    LegacyUtil.transformBlock(root, '[type="draw_circle"]', (block) => {
        upscale(block, 'RADIUS', xS);
    });
    LegacyUtil.transformBlock(root, '[type="draw_ellipse"]', (block) => {
        upscale(block, 'RADIUSX', xS);
        upscale(block, 'RADIUSY', yS);
    });

    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}