import { registerCreatorHelper } from '../../../creator/index.js';
import { IGeneratedStep } from '../../../creator/creator.js';
import { Field, FieldColour } from '@kano/kwc-blockly/blockly.js';

export function registerCreatorFieldHelper(fieldConstructor : typeof Field, helper : (prevValue : string, newValue : string, step : IGeneratedStep) => IGeneratedStep) {
    registerCreatorHelper('blockly', {
        field(field : Field, prevValue : string, newValue : string, step : IGeneratedStep) {
            if (!(field instanceof fieldConstructor)) {
                return step;
            }
            step = helper(prevValue, newValue, step);
            return step;
        }
    });
}

registerCreatorFieldHelper(FieldColour, (prevValue : string, newValue : string, step : IGeneratedStep) => {
    step.data.bannerCopy = `Change this color from <kano-value-preview><span>${prevValue}</span></kano-value-preview> to <kano-value-preview><span>${newValue}</span></kano-value-preview>`;
    return step;
});
