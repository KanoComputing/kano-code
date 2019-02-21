import { generate } from '../../../test/generate.js';
import { memoize } from './decorators.js';

suite('decorators', () => {
    suite('memoize', () => {
        test('method', () => {
            class Subject {
                @memoize
                aMethod() {
                    return generate.string();
                }
            }
    
            const inst = new Subject();
    
            const firstCall = inst.aMethod();
            const secondCall = inst.aMethod();
            assert.equal(firstCall, secondCall);
        });
        test('method with param', () => {
            assert.throws(() => {
                class Subject {
                    @memoize
                    aMethod(x : string) {
                        console.log(x);
                        return generate.string();
                    }
                }
            }, 'Memoize should only be used in functions with zero parameters');
        });
        test('property', () => {
            class Subject {
                @memoize
                get prop() {
                    return generate.string();
                }
            }
    
            const subject = new Subject();
    
            const firstCall = subject.prop;
            const secondCall = subject.prop;
            assert.equal(firstCall, secondCall);
        });
        test('param', () => {
            assert.throws(() => {
                class Subject {
                    method(@memoize x : string) {}
                }
            }, 'not supported');
        });
        test('setter', () => {
            assert.throws(() => {
                class Subject {
                    @memoize
                    set prop(v : string) {}
                }
            }, 'not supported');
        });
    });
});
