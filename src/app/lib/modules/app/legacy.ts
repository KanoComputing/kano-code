import { LegacyUtil } from '../../legacy/util.js';

export function transformLegacy(app : any) {
    if (!app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (!root) {
        return;
    }
    // Transform the event block
    LegacyUtil.transformBlock(root, 'block[type="part_event"]', (block) => {
        const field = block.querySelector('field[name="EVENT"]');
        if (!field) {
            return;
        }
        // Depending on the contents of the field, change the block type
        if (field.textContent === 'global.start') {
            block.setAttribute('type', 'app_onStart');
            block.removeChild(field);
            LegacyUtil.renameStatement(block, 'DO', 'CALLBACK');
        }
    });
    LegacyUtil.transformBlock(root, 'block[type="collision_event"]', (block) => {
        LegacyUtil.renameStatement(block, 'DO', 'CALLBACK');
        const aField = block.querySelector('[name="PART1"]');
        const bField = block.querySelector('[name="PART2"]');
        if (!aField || !bField) {
            return;
        }
        const aString = aField.innerHTML;
        const bString = bField.innerHTML;

        const extractor = /parts\.get\('(.+?)'\)/;

        const aMatch = aString.match(extractor);
        const bMatch = bString.match(extractor);

        if (!aMatch || !aMatch[1] || !bMatch || !bMatch[1]) {
            return;
        }
        const newA = document.createElement('field');
        newA.setAttribute('name', 'A');
        const newB = document.createElement('field');
        newB.setAttribute('name', 'B');

        newA.innerHTML = aMatch[1];
        newB.innerHTML = bMatch[1];

        block.appendChild(newA);
        block.appendChild(newB);

        aField.remove();
        bField.remove();
        block.setAttribute('type', 'app_onPartCollision');
    });
    const serializer = new XMLSerializer();
    app.source = serializer.serializeToString(root);
}