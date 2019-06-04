import { ICopyGenerator, CopyGenerators } from './creator.js';
import { ContributionManager } from '../contribution.js';

export function registerCopyGenerator(sourceType : string, type : string, generator : ICopyGenerator) {
    const copyGenerators = CopyGenerators.get(sourceType) || new ContributionManager<ICopyGenerator>();

    copyGenerators.register(type, generator);

    CopyGenerators.register(sourceType, copyGenerators);
}
