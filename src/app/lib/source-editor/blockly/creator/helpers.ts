import { registerCreatorHelper } from '../../../creator/index.js';
import { IGeneratedStep } from '../../../creator/creator.js';
import { Field, FieldColour, FieldDropdown, FieldVariable, Workspace, Variables, FieldNumber } from '@kano/kwc-blockly/blockly.js';
import '../challenge/ui/kc-color-preview.js';
import '../challenge/ui/kc-string-preview.js';

export function registerCreatorFieldHelper<T extends Field>(fieldConstructor : typeof Field, helper : (field : T, prevValue : string, newValue : string, step : IGeneratedStep) => IGeneratedStep) {
    registerCreatorHelper('blockly', {
        field(field : T, prevValue : string, newValue : string, step : IGeneratedStep) {
            if (!(field instanceof fieldConstructor)) {
                return step;
            }
            return helper(field, prevValue, newValue, step);
        }
    });
}

export function registerStepperFieldHelper<T extends Field>(fieldConstructor : typeof Field, helper : (field : T, value : string, workspace : Workspace) => string) {
    registerCreatorHelper('blockly', {
        loadField(field : T, value : string, workspace : Workspace) {
            if (!(field instanceof fieldConstructor)) {
                return value;
            }
            return helper(field, value, workspace);
        }
    });
}

registerCreatorFieldHelper(FieldNumber, (field : FieldNumber, prevValue : string, newValue : string, step : IGeneratedStep) => {
    step.data.bannerCopy = `Change this number from <kc-string-preview>${prevValue}</kc-string-preview> to <kc-string-preview>${newValue}</kc-string-preview>`;
    return step;
});

registerCreatorFieldHelper(FieldColour, (field : FieldColour, prevValue : string, newValue : string, step : IGeneratedStep) => {
    step.data.bannerCopy = `Change this color from <kc-color-preview color="${prevValue}"></kc-color-preview> to <kc-color-preview color="${newValue}"></kc-color-preview>`;
    step.data.skipCheck = true;
    return step;
});

registerCreatorFieldHelper(FieldDropdown, (field : FieldDropdown, prevValue : string, newValue : string, step : IGeneratedStep) => {
    if (field instanceof FieldVariable) {
        step.data.bannerCopy = `Change this variable from <kc-string-preview>${prevValue}</kc-string-preview> to <kc-string-preview>${newValue}</kc-string-preview>`;
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

/**
 * Transforms a variable name into an id for the stepper to set the right value in a variable field dropdown
 */
registerStepperFieldHelper(FieldVariable, (field : FieldVariable, value : string, workspace : Workspace) => {
    const variable = Variables.getVariable(workspace, null, value, '');
    if (!variable) {
        throw new Error(`Could not load challenge: Variable with name '${value}' does not exist`);
    }
    return variable.getId();
});
