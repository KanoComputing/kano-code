interface IMessageStore {
    [K : string] : string;
}

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
    return messages[key] || fallback;
}

export function addMessage(key : string, message : string) {
    messages[key] = message;
}


export function load(url : string) {
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
    return load(url)
        .then((m) => {
            addBlocklyMsg(m);
            return m;
        });
}

export default {
    localize,
    addMessage,
    load,
    getLang,
    getMessages,
    loadBlocklyMsg,
};
