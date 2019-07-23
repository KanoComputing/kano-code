import { Output } from './output.js';
import { join } from '../util/path.js';
import { Sticker } from '../parts/parts/sticker/types.js';

export interface IResource {
    id : string,
    label : string,
    path : string
}

export interface IResourceCategory {
    id : string,
    label : string,
    resources : { [key:string]: IResource }
}

export interface IResourceArrayWithSrc {
    id : string,
    label : string,
    resources : {
        id: string,
        src: string,
    }[]
}

export interface IResourceArrayCategory {
    id : string,
    label : string,
    resources : IResource[]
}

export interface IResourceInformation {
    default? : string,
    categories? : { [key:string]: IResourceCategory },
    categorisedResource : IResourceArrayWithSrc[],
    categoryEnum : [string, string][],
    getUrl : (id: string | Sticker | null) => string,
    getRandom : () => string,
    getRandomFrom : (id: string) => string,
    cacheValue: (id: string | Sticker) => HTMLImageElement | undefined
}

export interface IResources {
    stickers? : IResourceInformation,
    get: (id: string) => IResourceInformation | undefined
}

export class Resource<T> implements IResourceInformation {
    default : string;
    categories : { [key : string]: IResourceCategory };
    all: IResource[];
    allCategorised: IResourceArrayWithSrc[];
    cache = new Map<string | Sticker, HTMLImageElement | undefined>()

    constructor() {
        this.default = '';
        this.categories = {};
        this.all = [];
        this.allCategorised = [];
    }
    addCategory(id : string, label : string) {
        if (this.categories[id]) {
            console.warn('Category already exists')
            return
        }
        this.categories[id] = { id, label, resources: {} };
    }
    add(category : string, id : string, label : string, path : string) {
        if (!this.categories[category]) {
            console.warn('Category does not exist')
            return
        }
        if (this.categories[category].resources[id]) {
            console.warn('A sticker with this name has already been created')
            return
        }

        this.categories[category].resources[id] = { id, label, path: path }  
    }
    setDefault(id : string) {
        this.default = id;
    }

    resolve(path : string) {
        const ASSET_URL_PREFIX_KEY = 'sticker:base-url';

        const prefix = Output.config.get(ASSET_URL_PREFIX_KEY, '/assets/part/stickers');
        return encodeURI(join(prefix, path));
    }

    get resourceSet() {
        if (this.all.length > 0) {
            return this.all
        }
        
        Object.keys(this.categories).forEach(category => {
            Object.keys(this.categories[category].resources).forEach(sticker => {
                this.all.push(this.categories[category].resources[sticker])
            })
        })
        return this.all;
    }

    get categorisedResource() {
        if (this.allCategorised.length > 0) {
            return this.allCategorised
        }

        Object.keys(this.categories).forEach(category => {
            let categoryObject : IResourceArrayWithSrc = {
                id: this.categories[category].id,
                label: this.categories[category].label,
                resources: []
            }
            Object.keys(this.categories[category].resources).forEach(
                sticker => {
                    const stickerObject = {id: sticker, src: this.getUrl(sticker)}
                    categoryObject.resources.push( stickerObject )}
            )
            this.allCategorised.push(categoryObject)
        })
        return this.allCategorised;
    }

    get categoryEnum() {
        return Object.keys(this.categories).map<[string, string]>(category => [this.categories[category].label, this.categories[category].id])
    }

    cacheValue(id: string | Sticker, type = 'image') {
        if (type !== 'image') {
            console.warn('cached item type not recognised')
            return
        }

        if (this.cache.get(id)) {
            return this.cache.get(id)
        }

        const newImage = this.syncLoadImg(this.getUrl(id))

        this.cache.set(id, newImage);
        return newImage
    }

    syncLoadImg(src : string, timeout = 50) {
        const img = new Image();
        const started = Date.now();
        img.crossOrigin = "Anonymous";
        img.src = src;
        while(true) {
            if (img.complete || img.naturalWidth || Date.now() - started > timeout) {
                break;
            }
        }
        return img;
    }

    getRandom() {
        return this.resourceSet[Math.floor(Math.random() * this.resourceSet.length)].id;
    }

    getRandomFrom(id: string) {
        if (!this.categories[id]) {
            console.warn('Category does not exist')
            return this.default
        } else {
            const randomKey = Object.keys(this.categories[id].resources)[Math.floor(Math.random() * Object.keys(this.categories[id].resources).length)]
            return this.categories[id].resources[randomKey].id;
        }
    }

    getUrl(id: string | Sticker | null) {
        if (!id) {
            console.warn(`No sticker provided`);
            return '';
        }
        let selectedSticker = this.resourceSet.find(sticker => sticker.id === id)
        if (!selectedSticker) {
            selectedSticker = this.resourceSet.find(sticker => sticker.id === this.default)
        }
        if (!selectedSticker) {
            console.warn(`Sticker ${id} does not exist`)
            return '';
        }
        return this.resolve(selectedSticker.path);
    }

    getLabel(id: string) {
        const selectedSticker = this.resourceSet.find(sticker => sticker.id === id)
        if (!selectedSticker) {
            console.warn('Sticker does not exist')
            return
        }
        return this.resolve(selectedSticker.label);
    }
}

export class Resources implements IResources {
    resources: Map <string, IResourceInformation>
    constructor() {
        this.resources = new Map();
        this.resources.set('stickers', new Resource<HTMLImageElement>());
    }

    get(id: string) {
        return this.resources.get(id)
    }
}