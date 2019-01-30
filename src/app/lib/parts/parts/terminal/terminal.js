import { BaseMixin } from '../../base.js';

export const TerminalMixin = base => class extends BaseMixin(base) {
    toggle() {}
    printLine() {}
    print() {}
    clear() {}
};

export default TerminalMixin;
