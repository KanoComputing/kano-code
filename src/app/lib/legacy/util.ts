import { getStickerIdForLegacy } from '../parts/parts/sticker/legacy.js';

export const LegacyUtil = {
    getDOM(source : string) {
        const parser = new DOMParser();
        var DOM = parser.parseFromString(source, 'application/xml');
        if (DOM.documentElement.nodeName !== 'parsererror') {
            return DOM.documentElement;
        }
    },
    addPartBlocks(partData : any, root : HTMLElement) {
        // TODO: This work could make legacy shares upscale to the new width and height
        const xS = 1;
        const yS = 1;
        const tpl = document.createElement('template');

        function mathValue(input : string, value : number) {
            return `<value name="${input}"><shadow type="math_number"><field name="NUM">${value}</field></shadow></value>`
        }
        function textValue(input : string, value : string) {
            return `<value name="${input}"><shadow type="text"><field name="TEXT">${value}</field></shadow></value>`
        }
        function colorValue(input : string, value : string) {
            return `<value name="${input}"><shadow type="colour_picker"><field name="COLOUR">${value}</field></shadow></value>`
        }

        const uiParts = ['button', 'text', 'text-input', 'sticker', 'slider'];

        const blocks = [];

        if (uiParts.indexOf(partData.type) !== -1) {
            if (partData.position) {
                blocks.push(`<block type="${partData.id}_moveTo">${mathValue('X', partData.position.x * xS)}${mathValue('Y', partData.position.y * yS)}</block>`);
            }
            if (partData.scale) {
                blocks.push(`<block type="${partData.id}_setScale">${mathValue('SCALE', partData.scale * xS)}</block>`);
            }
        }

        if (partData.type === 'text') {
            if (partData.userProperties.text) {
                blocks.push(`<block type="${partData.id}_value_set">${textValue('VALUE', partData.userProperties.text)}</block>`);
            }
            if (partData.userStyle.color) {
                blocks.push(`<block type="${partData.id}_color_set">${colorValue('COLOR', partData.userStyle.color)}</block>`);
            }
        }
        if (partData.type === 'button') {
            if (partData.userProperties.label) {
                blocks.push(`<block type="${partData.id}_label_set">${textValue('LABEL', partData.userProperties.label)}</block>`);
            }
            if (partData.userStyle['background-color']) {
                blocks.push(`<block type="${partData.id}_background_set">${colorValue('BACKGROUND', partData.userStyle['background-color'])}</block>`);
            }
        }
        if (partData.type === 'sticker') {
            if (partData.userProperties.src) {
                const pieces = partData.userProperties.src.split('/')
                const oldValue = pieces.pop().split('.').shift();
                const oldSet = pieces.pop();
                const newSticker = getStickerIdForLegacy(oldSet, oldValue);
                blocks.push(`<block type="${partData.id}_image_set"><value name="IMAGE"><shadow type="stamp_getImage"><field name="STICKER">${newSticker}</field></shadow></value></block>`);
            }
        }
        if (partData.type === 'oscillator') {
            if (partData.userProperties.delay) {
                blocks.push(`<block type="${partData.id}_delay_set">${mathValue('DELAY', partData.userProperties.delay)}</block>`);
            }
            if (partData.userProperties.speed) {
                blocks.push(`<block type="${partData.id}_speed_set">${mathValue('SPEED', partData.userProperties.speed)}</block>`);
            }
            if (partData.userProperties.wave) {
                blocks.push(`<block type="${partData.id}_wave_set"><field name="WAVE">${partData.userProperties.wave}</field></block>`);
            }
        }

        const blockChain = blocks.reduce((acc, blockString) => {
            return `${blockString.replace('</block>', '')}<next>${acc}</next></block>`;
        }, '');

        tpl.innerHTML = `<block type="app_onStart"><statement name="CALLBACK">${blockChain}</statement></block>`

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
