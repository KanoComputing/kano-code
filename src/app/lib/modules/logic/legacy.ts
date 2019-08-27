import { LegacyUtil } from '../../legacy/util.js';

export function transformLegacyLogic(app : any) {
    if (!app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (!root) {
        return;
    }
    // Transform the event block
    LegacyUtil.transformBlock(root, 'block[type="controls_if"]', (block) => {
        const mutation = block.querySelector('mutation');
        if (!mutation || [...block.children].indexOf(mutation) === -1) {
            return;
        }
        const hasElse = mutation.getAttribute('else') === '1';
        const elseifCount = parseInt(mutation.getAttribute('elseif') || '0', 10);
        const field = document.createElement('field');
        field.setAttribute('name', 'CONFIG');
        field.innerHTML = JSON.stringify({ else: hasElse, elseIfs: elseifCount });
        block.insertBefore(field, mutation);
        mutation.remove();
    });
    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}