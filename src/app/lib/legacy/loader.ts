import { IEditor } from '../part/editor';
import AppModule from '../app-modules/app-module';

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
function rewriteModules(app : any, editor : IEditor) {
    const modules = editor.output.runner.getRegisteredModules();
    modules.forEach((mod) => {
        const moduleClass = (mod.constructor as typeof AppModule);
        if (!moduleClass.transformLegacy) {
            return;
        }
        moduleClass.transformLegacy(app);
    });
}

export function transformLegacyApp(app : any, editor : IEditor) {
    if (!app) {
        return app;
    }
    rewriteSource(app);
    rewriteParts(app, editor);
    rewriteModules(app, editor);
    return app;
}
