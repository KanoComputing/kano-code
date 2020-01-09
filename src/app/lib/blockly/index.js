/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { addMessage } from '../i18n/index.js';

class Blockly {
    static loadLang(url) {
        return fetch(url)
            .then(r => r.json())
            .then((messages) => {
                window.CustomBlocklyMsg = window.CustomBlocklyMsg || {};
                window.Blockly = window.Blockly || {};
                window.Blockly.Msg = window.Blockly.Msg || {};
                Object.assign(window.CustomBlocklyMsg, messages);
                Object.assign(window.Blockly.Msg, messages);
            });
    }
    static updateI18n() {
        // Adapt blockly messages to internal i18n engine
        Object.keys(window.Blockly.Msg).forEach((id) => {
            addMessage(`BLOCKLY_${id}`, window.Blockly.Msg[id]);
        });
    }
}

export default Blockly;