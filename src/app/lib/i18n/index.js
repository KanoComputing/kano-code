const messages = {};
const supportedLanguages = ['en-US', 'es-AR'];

let lang = window.navigator.languages ? window.navigator.languages[0] : null;
lang = lang || window.navigator.language
            || window.navigator.browserLanguage
            || window.navigator.userLanguage;
if (supportedLanguages.indexOf(lang) === -1) {
    lang = 'en-US';
}

function addBlocklyMsg(m) {
    if ('Blockly' in window) {
        Object.assign(window.Blockly.Msg, m);
    } else {
        window.CustomBlocklyMsg = window.CustomBlocklyMsg || {};
        Object.assign(window.CustomBlocklyMsg, m);
    }
}

function loadJSON(url) {
    return fetch(url)
        .then(r => r.json());
}

export function localize(key, fallback = '') {
    return messages[key] || fallback;
}

export function addMessage(key, message) {
    messages[key] = message;
}


export function load(url) {
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

export const I18nMixin = base => class extends base {
    localize(...args) {
        return localize(...args);
    }
};

export function loadBlocklyMsg(url) {
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
