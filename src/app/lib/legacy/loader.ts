import AppModule from '../app-modules/app-module';
import Editor from '../editor/editor';

function rewriteSource(app : any) {
    if (app.code && app.code.snapshot) {
        app.source = app.code.snapshot.blocks;
        delete app.code;
    }
}

function rewriteParts(app : any, editor : Editor) {
    const registered = editor.parts.getRegisteredParts();
    registered.forEach((partClass) => partClass.transformLegacy(app));
}
function rewriteModules(app : any, editor : Editor) {
    const modules = editor.output.runner.getRegisteredModules();
    modules.forEach((mod) => {
        const moduleClass = (mod.constructor as typeof AppModule);
        if (!moduleClass.transformLegacy) {
            return;
        }
        moduleClass.transformLegacy(app);
    });
}

export function transformLegacyApp(app : any, editor : Editor) {
    if (!app) {
        return app;
    }
    rewriteSource(app);
    rewriteModules(app, editor);
    rewriteParts(app, editor);
    return app;
}
