import { collectPrototype } from './util.js';

suite('PartsUtils', () => {
    test('collectPrototype()', () => {
        class Root {
            static get test() : any {
                return {
                    a: 1,
                };
            }
        }
        class Branch extends Root {
            static get test() : any {
                return {
                    b: 2,
                };
            }
        }
        class Leaf extends Branch {
            static get test() : any {
                return {
                    c: 3,
                };
            }
        }

        const collection = collectPrototype<{ [K : string] : number }>('test', Leaf, Root);

        assert(collection.has('c'));
        assert(collection.has('b'));
        assert(!collection.has('a'));
    });
});