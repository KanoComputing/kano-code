import { EventEmitter } from '@kano/common/index.js';
import { PartComponent, registerTypeSerializer, defaultSerializer } from './component.js';
import { property } from './decorators.js';

class EmptyProp extends PartComponent {
    static get properties() {
        return {
            a: {},
        };
    }
}

class PropNoType extends PartComponent {
    static get properties() {
        return {
            a: {
                type: Symbol(),
            },
        };
    }
}

class PropValue extends PartComponent {
    static get properties() {
        return {
            a: {
                type: Number,
                value: 2,
            },
        };
    }
}

class PropValueFunc extends PartComponent {
    static get properties() {
        return {
            a: {
                type: Number,
                value: () => 7,
            },
        };
    }
}

class Serializable extends PartComponent {
    static get properties() {
        return {
            a: {
                type: Boolean,
                value: true,
            },
            b: {
                type: Number,
                value: 2,
            },
            c: {
                type: String,
                value: 'string',
            },
            d: {
                type: EventEmitter,
                value: () => new EventEmitter(),
            },
        };
    }
}

class UnknownType extends PartComponent {
    static get properties() {
        return {
            a: {
                type: null,
                value: true,
            },
        };
    }
}

class Reset extends PartComponent {
    @property({ type: Number, value: 0 })
    public a : number = 0;
    @property({ type: String, value: () => 'test' })
    public b : string = 'test';
}

suite('PartComponent', () => {
    test('_setupProperties', () => {
        assert.throws(() => new EmptyProp());
        assert.throws(() => new PropNoType());

        const valueCompTest = new PropValue();
        assert.equal(valueCompTest.a, 2);

        const funcCompTest = new PropValueFunc();
        assert.equal(funcCompTest.a, 7);
    });
    test('invalidate', () => {
        const comp = new PropValue();

        // invalidated by default
        assert.equal(comp.invalidated, true);
        comp.apply();
        assert.equal(comp.invalidated, false);
        comp.invalidate();
        assert.equal(comp.invalidated, true);
    });
    test('serialize', () => {
        assert.throws(() => new UnknownType());

        const TestType = Symbol();

        registerTypeSerializer(TestType, defaultSerializer);

        class CustomType extends PartComponent {
            static get properties() {
                return {
                    a: {
                        type: TestType,
                        value: 2,
                    },
                };
            }
        }

        // Throws if type is not setup properly
        new CustomType();

        const s = new Serializable();

        const data = s.serialize();

        const loaded = new Serializable();

        loaded.load(data);

        ['a', 'b', 'c'].forEach((key) => {
            assert.equal(s[key], loaded[key]);
        });
    });
    test('#reset()', () => {
        const component = new Reset();

        assert.equal(component.a, 0);
        assert.equal(component.b, 'test');
        
        component.a = 47;
        component.b = 'reset';

        component.reset();

        assert.equal(component.a, 0);
        assert.equal(component.b, 'test');
    });
});
