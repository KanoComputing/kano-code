import { registerCopyGenerator } from '../../../creator/copy.js';

registerCopyGenerator('blockly', 'default', {
    openFlyout(category : string) {
        return `Open the \${${category}} tray`;
    },
    grabBlock() {
        return 'Pick up the block with your mouse or finger and drag it into the middle';
    },
    connect() {
        return 'Connect please';
    },
    drop() {
        return 'Drop it onto your code space to add it into your program.';
    },
    value(defaultValue : string, currentValue : string) {
        return `Change this value from <kc-string-preview>${defaultValue}</kc-string-preview> to <kc-string-preview>${currentValue}</kc-string-preview>`;
    },
});
