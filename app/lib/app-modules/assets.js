import { AssetsModuleFactory } from './factory/assets.js';
// TODO: Move to standalone sticker definition for kano-code
import { stickers } from '../parts/parts/sticker/stickers.js';
import { config } from '../../scripts/config/config.js';

const appRoot = config.KANO_CODE_URL;

const assetsRoot = `${appRoot}/assets/part/stickers/`;

export const AssetsModule = AssetsModuleFactory(assetsRoot, stickers);

export default AssetsModule;
