import { Msg } from '../../../elements/behaviors/kano-i18n-behavior.js';

let CopyManager;

CopyManager = {
    get (id) {
        if (Msg.Groups[id]) {
            let values = Msg.Groups[id],
                r;
            if (!values) {
                throw new Error("Action '" + id + "' has no translation associated");
            }
            r = Math.floor(Math.random() * values.length);
            id = values[r];
        }
        return Msg[id];
    }
}

export { CopyManager };
