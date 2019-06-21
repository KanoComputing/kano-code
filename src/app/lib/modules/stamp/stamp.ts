import { AppModule } from '../../app-modules/app-module.js';
import { defaultStamp, stamps } from './data.js';
import { reduceAllImages } from '../../util/image-stamp.js';

export function random() {
    const all = reduceAllImages(stamps);
    const allKeys = Object.keys(all);
    const idx = Math.floor(Math.random() * allKeys.length);
    return allKeys[idx];
}

export function randomFrom(index: string) {
    const set = stamps.find(stamp => stamp.id === index);
    if (!set) {
        return defaultStamp
    }
    const allKeys = Object.keys(set.stickers);
    const idx = Math.floor(Math.random() * allKeys.length);
    return allKeys[idx];
}

export class StampModule extends AppModule {
    static get id() {
        return 'stamp';
    }
    constructor(output : any) {
        super(output);

        this.addMethod('random', random);
        this.addMethod('randomFrom', randomFrom);
    }

}

export default StampModule;
