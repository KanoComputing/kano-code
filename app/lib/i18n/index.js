const messages = {};
const supportedLanguages = ['en-US', 'es-AR'];

let lang = window.navigator.languages ? window.navigator.languages[0] : null;
lang = lang || window.navigator.language
            || window.navigator.browserLanguage
            || window.navigator.userLanguage;
if (supportedLanguages.indexOf(lang) === -1) {
    lang = 'en-US';
}

function localize(key, fallback = '') {
    return messages[key] || fallback;
}

function addMessage(key, message) {
    messages[key] = message;
}

function load(url) {
    return fetch(url)
        .then(r => r.json())
        .then((m) => {
            Object.assign(messages, m);
            return m;
        });
}

function getLang() {
    return lang;
}

// Legacy I18n support
function getMessages() {
    return messages;
}

export const I18nMixin = base => class extends base {
    localize(...args) {
        return localize(...args);
    }
};

export default {
    localize,
    addMessage,
    load,
    getLang,
    getMessages,
};

export {
    localize,
    addMessage,
    load,
    getLang,
    getMessages,
};
