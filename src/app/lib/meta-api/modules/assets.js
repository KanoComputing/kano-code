import { AssetsModuleFactory } from './factory/assets.js';
// TODO: Move to standalone sticker definition for kano-code
import { stickers } from '../../parts/parts/sticker/stickers.js';

export const AssetsAPI = AssetsModuleFactory(stickers, 'animals');

export default AssetsAPI;
