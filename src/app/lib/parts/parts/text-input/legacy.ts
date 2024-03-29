/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDOMPart } from '../dom/legacy.js';

export function transformLegacyTextInput(app : any) {
    transformLegacyDOMPart('text-input', app);
    if (app.source) {
        const root = LegacyUtil.getDOM(app.source);
        if (!root) {
            return;
        }
        LegacyUtil.forEachPart(app, 'text-input', ({ id }) => {
            LegacyUtil.transformBlock(root, `block[type="${id}#input_text_set_value"]`, (block) => {
                LegacyUtil.renameValue(block, 'INPUT', 'VALUE');
                block.setAttribute('type', `${id}_value_set`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#input_text_get_value"]`, (block) => {
                block.setAttribute('type', `${id}_value_get`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#input_text_set_placeholder"]`, (block) => {
                block.setAttribute('type', `${id}_placeholder_set`);
            });
            LegacyUtil.transformBlock(root, `block[type="${id}#input_text_get_placeholder"]`, (block) => {
                block.setAttribute('type', `${id}_placeholder_get`);
            });
            LegacyUtil.transformEventBlock(root, `${id}.input-keyup`, `${id}_onChange`, 'CALLBACK');
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}