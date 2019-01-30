import { getMessages } from '../../lib/i18n/index.js';

export const Msg = {};

// @polymerBehavior Kano.Behaviors.I18nBehavior
export const I18nBehavior = {
    created() {
        // Store a key prefix for the localised strings based on the tag name.
        // For example, `kano-workspace-head` becomes `KANO_WORKSPACE_HEAD`
        this._msgKeyPrefix = this.tagName.replace(/-/g, '_').toUpperCase();
    },
    /**
     * Returns a localised string or the fallback string provided. Scoped to the element tag name
     */
    localize(key, fallback) {
        const scopedKey = `${this._msgKeyPrefix}_${key}`;
        const messages = getMessages();
        return messages[scopedKey] || messages[key] || fallback || '';
    },
};
