import * as path from '../util/path.js';
import { blocklyLangMap } from './blockly.js';

interface IMessageStore {
    [K : string] : string;
}

const DEFAULT_MODULES_PATH = '/node_modules/';

const messages : IMessageStore = {};
const supportedLanguages = ['en-US', 'es-AR'];

let lang = window.navigator.languages ? window.navigator.languages[0] : null;
lang = lang || (window as any).navigator.language
            || (window as any).navigator.browserLanguage
            || (window as any).navigator.userLanguage;

if (!lang || supportedLanguages.indexOf(lang) === -1) {
    lang = 'en-US';
}

function addBlocklyMsg(m : IMessageStore) {
    if ('Blockly' in window) {
        Object.assign((window as any).Blockly.Msg, m);
    } else {
        (window as any).CustomBlocklyMsg = (window as any).CustomBlocklyMsg || {};
        Object.assign((window as any).CustomBlocklyMsg, m);
    }
}

function loadJSON(url : string) {
    return fetch(url)
        .then(r => r.json());
}

export function localize(key : string, fallback = '') {
    console.log(key);
    return messages[key] || fallback;
}

export function addMessage(key : string, message : string) {
    messages[key] = message;
}

export function loadMessages(url : string) {
    return loadJSON(url)
        .then((m) => {
            Object.assign(messages, m);
            return m;
        });
}

export function getLang() {
    return lang;
}

// Legacy I18n support
export function getMessages() {
    return messages;
}

declare type Constructor<T> = {
    new(...args: any[]) : T;
}

export const I18nMixin = <B extends Constructor<HTMLElement>>(base : B) => class extends base {
    localize(key : string, fallback? : string) {
        return localize(key, fallback);
    }
};

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
    const tasks : Promise<void>[] = [loadMessages(path.join(kanoCodePath, `/locale/editor/${lang}.json`))];
    if (opts.blockly) {
        tasks.push(loadBlocklyMsg(path.join(kanoCodePath, `/locale/blockly/${lang}.json`)));
        tasks.push(loadBlocklyMsg(path.join(modulesPath, `/@kano/kwc-blockly/blockly_built/msg/json/${blocklyLangMap[lang]}.json`)));
        tasks.push(loadBlocklyMsg(path.join(modulesPath, '/@kano/kwc-blockly/blockly_built/msg/json/constants.json')));
    }
    return Promise.all(tasks);
}

export const _ = localize;

export default {
    _: localize,
    localize,
    addMessage,
    load,
    loadMessages,
    getLang,
    getMessages,
    loadBlocklyMsg,
};
