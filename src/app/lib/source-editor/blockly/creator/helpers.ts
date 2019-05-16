import { registerCreatorHelper } from '../../../creator/index.js';
import { IGeneratedStep } from '../../../creator/creator.js';
import { Field, FieldColour, FieldDropdown, FieldVariable } from '@kano/kwc-blockly/blockly.js';

export function registerCreatorFieldHelper<T extends Field>(fieldConstructor : typeof Field, helper : (field : T, prevValue : string, newValue : string, step : IGeneratedStep) => IGeneratedStep) {
    registerCreatorHelper('blockly', {
        field(field : T, prevValue : string, newValue : string, step : IGeneratedStep) {
            if (!(field instanceof fieldConstructor)) {
                return step;
            }
            step = helper(field, prevValue, newValue, step);
            return step;
        }
    });
}

registerCreatorFieldHelper(FieldColour, (field : FieldColour, prevValue : string, newValue : string, step : IGeneratedStep) => {
    step.data.bannerCopy = `Change this color from <kano-value-preview><span>${prevValue}</span></kano-value-preview> to <kano-value-preview><span>${newValue}</span></kano-value-preview>`;
    return step;
});

registerCreatorFieldHelper(FieldDropdown, (field : FieldDropdown, prevValue : string, newValue : string, step : IGeneratedStep) => {
    if (field instanceof FieldVariable) {
        return step;
    } else {
        const options = field.getOptions();
        const prevOption = options.find(([, value]) => value === prevValue);
        const newOption = options.find(([, value]) => value === newValue);
        if (!prevOption) {
            throw new Error(`Could not find label for field '${field.name}' with value '${prevValue}'`);
        }
        if (!newOption) {
            throw new Error(`Could not find label for field '${field.name}' with value '${newValue}'`);
        }
        step.data.bannerCopy = `Change this value from <kano-value-preview><span>${prevOption[0]}</span></kano-value-preview> to <kano-value-preview><span>${newOption[0]}</span></kano-value-preview>`;
        return step;
    }
});
