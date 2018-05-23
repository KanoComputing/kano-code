import { Base } from './base.js';

const Terminal = {
    toggle () {},
    printLine () {},
    print () {},
    clear () {},
};

/**
 * @polymerBehavior
 * */
export const terminal = Object.assign({}, Base, Terminal);
