declare module 'flow-down/plugin/array-selector.js' {
    import { Store } from 'flow-down/flow-down.js';

    function ArraySelector(store : Store) : Store;
    export = ArraySelector;
}