import { PartEditorField } from './field.js';

suite('Field', () => {
    const fields : PartEditorField<number>[] = [];
    function basic(key : string, value : any) {
        const field = new PartEditorField<number>({ [key]: value }, key);
        fields.push(field);
        return field;
    }
    test('#getValue()', () => {
        const field = basic('test', 2);
        const value = field.getValue();
        assert.equal(value, 2);
    });
    test('#setValue()', () => {
        const field = basic('test', 2);
        const newValue = Math.random();
        field.setValue(newValue);
        assert.equal((field as any)._component['test'], newValue);
    });
    test('#getFullKeyName()', () => {
        const field = basic('testName', 2);
        const fullName = field.getFullKeyName();
        assert.equal(fullName, 'Test Name');
    });
    test('#dispose()', () => {
        const field = new PartEditorField<number>({ test: 2 }, 'test');
        (field as any)._el = document.createElement('div');
        document.body.appendChild((field as any)._el);
        field.dispose();
        assert.isNull((field as any)._el.parentNode);
    });
    teardown(() => {
        fields.forEach((f) => {
            f.dispose();
        });
        fields.length = 0;
    });
});
