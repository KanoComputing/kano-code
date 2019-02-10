export const LegacyUtil = {
    getDOM(source : string) {
        const parser = new DOMParser();
        var DOM = parser.parseFromString(source, 'application/xml');
        if (DOM.documentElement.nodeName !== 'parsererror') {
            return DOM.documentElement;
        }
    },
    transformBlock(root : HTMLElement, selector : string, mutator : (block : HTMLElement) => void) {
        const all = [...root.querySelectorAll(selector)] as HTMLElement[]
        all.forEach(b => mutator(b));
    },
    transformField(block : HTMLElement, name: string, mutator : (name : string, content : string|null) => { name : string, content : string }) {
        const field = block.querySelector(`field[name="${name}"]`);
        if (!field) {
            return;
        }
        const result = mutator(field.getAttribute('name')!, field.textContent);
        field.setAttribute('name', result.name);
        field.textContent = result.content
    },
    renameElement(block : HTMLElement, tag : string, name : string, newName : string) {
        const el = block.querySelector(`${tag}[name="${name}"]`);
        if (!el) {
            return;
        }
        el.setAttribute('name', newName);
    },
    renameValue(block : HTMLElement, name : string, newName : string) {
        return this.renameElement(block, 'value', name, newName);
    },
    renameStatement(block : HTMLElement, name : string, newName : string) {
        return this.renameElement(block, 'statement', name, newName);
    },
    transformEventBlock(root : HTMLElement, event : string, type : string, statement : string) {
        this.transformBlock(root, 'block[type="part_event"]', (block) => {
            const field = block.querySelector('field[name="EVENT"]');
            if (!field) {
                return;
            }
            // Depending on the contents of the field, change the block type
            if (field.textContent === event) {
                block.setAttribute('type', type);
                block.removeChild(field);
                LegacyUtil.renameStatement(block, 'DO', statement);
            }
        });
    },
    forEachPart(app : any, type : string, callback : (part : any) => void) {
        const part : any[] = app.parts.filter((part : any) => part.type === type);
        part.forEach(callback);
    },
}
