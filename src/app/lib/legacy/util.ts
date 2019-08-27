import { stickersMap } from '../parts/parts/sticker/legacy.js';

export const LegacyUtil = {
    getDOM(source : string) {
        const parser = new DOMParser();
        var DOM = parser.parseFromString(source, 'application/xml');
        if (DOM.documentElement.nodeName !== 'parsererror') {
            return DOM.documentElement;
        }
    },
    addPartBlocks(partData : any, root : HTMLElement) {
        const tpl = document.createElement('template');

        function mathValue(input : string, value : number) {
            return `<value name="${input}"><shadow type="math_number"><field name="NUM">${value}</field></shadow></value>`
        }

        if (partData.position) {
            tpl.innerHTML += `<block type="${partData.id}_moveTo">${mathValue('X', partData.position.x)}${mathValue('Y', partData.position.y)}</block>`;
        }
        if (partData.scale) {
            tpl.innerHTML += `<block type="${partData.id}_setScale">${mathValue('SCALE', partData.scale)}</block>`
        }
        console.log(partData);
        if (partData.type === 'text') {
            if (partData.userProperties.text) {
                tpl.innerHTML += `<block type="${partData.id}_value_set"><value name="VALUE"><shadow type="text"><field name="TEXT">${partData.userProperties.text}</field></shadow></value></block>`;
            }
        }
        if (partData.type === 'sticker') {
            if (partData.userProperties.src) {
                const oldValue = partData.userProperties.src.split('/').pop().split('.').shift();
                console.log(oldValue);
                tpl.innerHTML += `<block type="${partData.id}_image_set"><value name="IMAGE"><shadow type="stamp_getImage"><field name="STICKER">${stickersMap[oldValue]}</field></shadow></value></block>`
            }
        }
        root.appendChild(tpl.content);
        return root;
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
        if (!app.parts) {
            return;
        }
        const part : any[] = app.parts.filter((part : any) => part.type === type);
        part.forEach(callback);
    },
}
