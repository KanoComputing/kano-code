import { IEditor } from '../part/editor';

export const BlocklyTransformer = {
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
    renameValue(block : HTMLElement, name : string, newName : string) {
        const el = block.querySelector(`value[name="${name}"]`);
        if (!el) {
            return;
        }
        el.setAttribute('name', newName);
    }
}

function rewriteSource(app : any) {
    if (app.code) {
        app.source = app.code.snapshot.blocks;
        delete app.code;
    }
}

function rewriteParts(app : any, editor : IEditor) {
    const registered = editor.parts.getRegisteredParts();
    registered.forEach((partClass) => partClass.transformLegacy(app));
}

export function transformLegacyApp(app : any, editor : IEditor) {
    if (!app) {
        return app;
    }
    rewriteSource(app);
    rewriteParts(app, editor);
    return app;
}
