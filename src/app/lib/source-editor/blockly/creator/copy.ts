/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { registerCopyGenerator } from '../../../creator/copy.js';

registerCopyGenerator('blockly', 'default', {
    openFlyout(category : string) {
        return `Open the \${${category}} tray.`;
    },
    grabBlock() {
        return 'Drag this block into the code space.';
    },
    connect() {
        return 'Connect to this block.';
    },
    drop() {
        return 'Drop this block anywhere in your code space.';
    },
    value(defaultValue : string, currentValue : string) {
        return `Change <kc-string-preview>${defaultValue}</kc-string-preview> to <kc-string-preview>${currentValue}</kc-string-preview>.`;
    },
    openParts(part : string) {
        return `Add a \${${part}} part, using the Add Parts button.`;
    },
});
