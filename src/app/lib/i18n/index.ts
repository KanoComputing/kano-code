import { addSupportedLanguage, loadMessages, IMessageDB } from '@kano/i18n/dist/index.js';
import * as path from '../util/path.js';
import { blocklyLangMap } from './blockly.js';

export * from '@kano/i18n/dist/index.js';
export * from '@kano/i18n/dist/polymer.js';

const DEFAULT_MODULES_PATH = '/node_modules/';

addSupportedLanguage('es-AR');
addSupportedLanguage('fr-FR');

function addBlocklyMsg(m : IMessageDB) {
    if ('Blockly' in window) {
        Object.assign((window as any).Blockly.Msg, m);
    } else {
        (window as any).CustomBlocklyMsg = (window as any).CustomBlocklyMsg || {};
        Object.assign((window as any).CustomBlocklyMsg, m);
    }
}

export function loadBlocklyMsg(url : string) {
    return loadMessages(url)
        .then((m) => {
            addBlocklyMsg(m);
            return m;
        });
}

export interface ILoadOptions {
    modulesPath : string;
    blockly? : boolean;
    kanoCodePath? : string;
}

export function load(lang : string, opts : ILoadOptions = { modulesPath: DEFAULT_MODULES_PATH }) {
    const modulesPath = opts.modulesPath || DEFAULT_MODULES_PATH;
    const kanoCodePath = opts.kanoCodePath || path.join(modulesPath, '/@kano/code');
    const tasks : Promise<IMessageDB>[] = [loadMessages(path.join(kanoCodePath, `/locale/editor/${lang}.json`))];
    if (opts.blockly) {
        tasks.push(loadBlocklyMsg(path.join(kanoCodePath, `/locale/blockly/${lang}.json`)));
        tasks.push(loadBlocklyMsg(path.join(modulesPath, `/@kano/kwc-blockly/blockly_built/msg/json/${blocklyLangMap[lang]}.json`)));
        tasks.push(loadBlocklyMsg(path.join(modulesPath, '/@kano/kwc-blockly/blockly_built/msg/json/constants.json')));
    }
    return Promise.all(tasks);
}

export default {
    load,
    loadBlocklyMsg,
};
