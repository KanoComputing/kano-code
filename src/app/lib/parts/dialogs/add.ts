/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { DialogProvider } from '../../editor/dialogs/dialog-provider.js';
import { EventEmitter, subscribeDOM, IDisposable } from '@kano/common/index.js';
import { KCAddPart } from './kc-add-part.js';
import { IPartAPI } from '../api.js';

export class AddPartDialogProvider extends DialogProvider {
    public domNode : KCAddPart = new KCAddPart();
    private _clickSub : IDisposable;
    private _onDidClickPart : EventEmitter<string> = new EventEmitter<string>();
    constructor() {
        super();
        this._clickSub = subscribeDOM(this.domNode, 'part-click', (e : any) => {
            this._onDidClickPart.fire(e.detail.type);
        });
    }
    get onDidClickPart() {
        return this._onDidClickPart.event;
    }
    setParts(parts : IPartAPI[]) {
        this.domNode.parts = parts;
    }
    setWhitelist(parts : string[]) {
        this.domNode.whitelist = parts;
    }
    createDom() : any {
        return this.domNode;
    }
    getPartButton(type : string) {
        return this.domNode.getPartElement(type) as HTMLElement;
    }
    dispose() {
        this._clickSub.dispose();
    }
}

export default AddPartDialogProvider;
