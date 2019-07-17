import Output from '../output/output.js';
import { join } from './path.js';
import { _ } from '../i18n/index.js';

type StickerList = { id: string, label : string, stickers : { [K : string] : string } }[]

const ASSET_URL_PREFIX_KEY = 'sticker:base-url';

export function reduceAllImages(list: StickerList) {
    return list.reduce<{ [K : string] : string }>((acc, item) => Object.assign(acc, item.stickers), {})
}

export function resolve(item: string) {
    const prefix = Output.config.get(ASSET_URL_PREFIX_KEY, '/assets/part/stickers');
    return encodeURI(join(prefix, item));
}
