import { Part } from './part.js';
import { Output } from '../output/output.js';

export type PartContructor = Type<Part> & {
    type : string;
    partName : string;
}

export class PartsManager {
    private _parts : Set<Part> = new Set();
    private _registeredParts : Map<string, PartContructor> = new Map();
    private output : Output;
    constructor(output : Output) {
        this.output = output;
    }
    getRegisteredParts() {
        return this._registeredParts;
    }
    onInject() {
        this.output.dom.root.style.position = 'relative';
    }
    registerPart(partClass : PartContructor) {
        this._registeredParts.set(partClass.type, partClass);
    }
    addPart(partClass : Type<Part>, data? : any) {
        const part = new partClass();
        if (data) {
            part.load(data);
        }
        part.onInstall({
            visuals: this.output.visuals,
            audio: this.output.audio,
            dom: this.output.dom,
        });
        this._parts.add(part);
    }
    save() {
        const state : { [K : string] : any }[] = []
        this._parts.forEach((part) => {
            state.push(part.serialize());
        });
        return state;
    }
    load(partsData : { [K : string] : any }[]) {
        this.reset();
        partsData.forEach((data) => {
            const partClass = this._registeredParts.get(data.type);
            if (!partClass) {
                console.warn(`Could not load part '${data.type}': This part was not registered`);
                return;
            }
            this.addPart(partClass, data);
        });
    }
    reset() {
        this._parts.forEach(p => p.dispose());
        this._parts.clear();
    }
}
