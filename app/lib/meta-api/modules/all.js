import BlocklyAssets from './assets.js';
import BlocklyColor from './color.js';
import BlocklyControl from './control.js';
import BlocklyLists from './lists.js';
import BlocklyLogic from './logic.js';
import BlocklyMath from './math.js';
import BlocklyVariables from './variables.js';
import { EventsModuleFactory } from './factory/index.js';

export const AllApis = [
    BlocklyControl,
    BlocklyLogic,
    BlocklyMath,
    BlocklyVariables,
    BlocklyColor,
    BlocklyLists,
    BlocklyAssets,
];

export { EventsModuleFactory };

export default AllApis;
