/*
 * Copyright (C) 2016-2020 Kano Computing Ltd.
 * License: http://www.gnu.org/licenses/gpl-2.0.txt GNU General Public License v2
 */

import { Part } from './part.js';
import { Output } from '../output/output.js';

export interface ISerializedPart {
    id? : string;
    name? : string;
    [K : string] : any;
}

export class PartsManager {
    private _parts : Set<Part> = new Set();
    private _registeredParts : Map<string, typeof Part> = new Map();
    private output : Output;
    // If it is managed, the loading from an export will be done by the editor
    public managed : boolean = false;
    constructor(output : Output) {
        this.output = output;
    }
    getRegisteredParts() {
        return this._registeredParts;
    }
    getParts() {
        return this._parts;
    }
    onInject() {
        this.output.dom.root.style.position = 'relative';
    }
    registerPart(partClass : typeof Part) {
        this._registeredParts.set(partClass.type, partClass);
    }
    addPart(partClass : typeof Part, data? : ISerializedPart) : Part {
        const part = new partClass();
        if (data) {
            part.load(data);
        }
        part.onInstall({
            visuals: this.output.visuals,
            audio: this.output.audio,
            dom: this.output.dom,
            resources: this.output.resources,
        });
        this._parts.add(part);
        return part;
    }
    removePart(part : Part) {
        part.dispose();
        this._parts.delete(part);
    }
    save() {
        const state : { [K : string] : any }[] = []
        this._parts.forEach((part) => {
            state.push(part.serialize());
        });
        return state;
    }
    load(partsData : { [K : string] : any }[]) {
        // The loading is handled by the editor when managed
        if (this.managed) {
            return;
        }
        this.reset();
        partsData.forEach((data) => {
            const partClass = this._registeredParts.get(data.type);
            if (!partClass) {
                console.warn(`Could not load part '${data.type}': This part was not registered`);
                return;
            }
            this.addPart(partClass, data as ISerializedPart);
        });
    }
    reset() {
        this._parts.forEach(p => p.dispose());
        this._parts.clear();
    }
}
