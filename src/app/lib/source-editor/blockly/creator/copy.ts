import { registerCopyGenerator } from '../../../creator/copy.js';

registerCopyGenerator('blockly', 'default', {
    openFlyout(category : string) {
        return `Open the \${${category}} tray`;
    },
    grabBlock() {
        return 'Drag this block with your mouse or finger into the code space';
    },
    connect() {
        return 'Connect to this block';
    },
    drop() {
        return 'Drop the block anywhere in your code space';
    },
    value(defaultValue : string, currentValue : string) {
        return `Change <kc-string-preview>${defaultValue}</kc-string-preview> to <kc-string-preview>${currentValue}</kc-string-preview>`;
    },
    openParts(part : string) {
        return `Add a \${${part}} part, use the Add Parts button`;
    },
});
