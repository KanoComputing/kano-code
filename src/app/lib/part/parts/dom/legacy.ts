import { LegacyUtil } from '../../../legacy/util.js';

export function transformLegacyDOMPart(type : string, app : any) {
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, type, ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#ui_move_by"]`, (block) => {
                block.setAttribute('type', `${id}_moveAlong`);
                LegacyUtil.renameValue(block, 'pixels', 'DISTANCE');
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#ui_rotate"]`, (block) => {
                block.setAttribute('type', `${id}_turn`);
                LegacyUtil.transformField(block, 'DIR', (name, content) => {
                    let newContent = 'to';
                    if (content === 'cw') {
                        newContent = 'clockwise';
                    } else if (content === 'ccw') {
                        newContent = 'counterclockwise';
                    }
                    return {
                        name: 'TYPE',
                        content: newContent,
                    };
                });
                LegacyUtil.renameValue(block, 'DEG', 'ROTATION');
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#ui_scale"]`, (block) => {
                block.setAttribute('type', `${id}_setScale`);
                LegacyUtil.renameValue(block, 'FACTOR', 'SCALE');
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#ui_set_x_y"]`, (block) => {
                block.setAttribute('type', `${id}_moveTo`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#ui_show_hide"]`, (block) => {
                block.setAttribute('type', `set_${id}_opacity`);
                const field = block.querySelector('field[name="VISIBILITY"]');
                if (!field) {
                    return;
                }
                // Build a DOM tree with value>shadow>field to set the opacity to either
                // 100 or 0 depending on the value of the previous field (show or hide)
                const value = document.createElement('value');
                value.setAttribute('name', 'OPACITY');

                const shadow = document.createElement('shadow');
                shadow.setAttribute('type', 'math_number');

                const mathField = document.createElement('field');
                mathField.setAttribute('name', 'NUM');

                shadow.appendChild(mathField);
                value.appendChild(shadow);
                // Insert the math value depending on show or hide
                if (field.textContent === 'show') {
                    mathField.textContent = '100';
                } else {
                    mathField.textContent = '0';
                }
                // Remove the enum field
                block.removeChild(field);
                block.appendChild(value);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#ui_x"]`, (block) => {
                block.setAttribute('type', `get_${id}_x`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#ui_y"]`, (block) => {
                block.setAttribute('type', `get_${id}_y`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#ui_size"]`, (block) => {
                block.setAttribute('type', `get_${id}_scale`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#ui_rotation"]`, (block) => {
                block.setAttribute('type', `get_${id}_rotation`);
            });
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}