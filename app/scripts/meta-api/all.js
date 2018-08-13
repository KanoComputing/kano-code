import BlocklyAssets from '../../lib/meta-api/modules/assets.js';
import BlocklyColor from '../../lib/meta-api/modules/color.js';
import BlocklyControl from '../../lib/meta-api/modules/control.js';
import BlocklyLists from '../../lib/meta-api/modules/lists.js';
import BlocklyLogic from './logic.js';
import BlocklyMath from '../../lib/meta-api/modules/math.js';
import BlocklyVariables from '../../lib/meta-api/modules/variables.js';
import { EventsModuleFactory } from '../../lib/meta-api/modules/all.js';

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
