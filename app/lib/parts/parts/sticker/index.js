import { config } from '../../../../scripts/config/config.js';
import { StickerFactory } from './factory.js';
import { stickers } from './stickers.js';

import './kano-ui-sticker.js';

const appRoot = config.KANO_CODE_URL;

const sticker = StickerFactory(appRoot, stickers);

export default sticker;
