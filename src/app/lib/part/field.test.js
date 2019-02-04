import { PartEditorField } from './field.js';

suite('Field', () => {
    const fields = [];
    function basic(key, value) {
        const field = new PartEditorField({ [key]: value }, key);
        fields.push(field);
        return field;
    }
    test('getValue', () => {
        const field = basic('test', 2);
        const value = field.getValue();
        assert.equal(value, 2);
    });
    test('setValue', () => {
        const field = basic('test', 2);
        const newValue = Math.random();
        field.setValue(newValue);
        assert.equal(field._component['test'], newValue);
    });
    test('getFullKeyName', () => {
        const field = basic('testName', 2);
        const fullName = field.getFullKeyName();
        assert.equal(fullName, 'Test Name');
    });
    test('dispose', () => {
        const field = new PartEditorField({ test: 2 }, 'test');
        field._el = document.createElement('div');
        document.body.appendChild(field._el);
        field.dispose();
        assert.isNull(field._el.parentNode);
    });
    teardown(() => {
        fields.forEach((f) => {
            f.dispose();
        });
        fields.length = 0;
    });
});
