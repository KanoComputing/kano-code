import { IndexedPickerFieldStepHelper } from './indexed-picker.js';
import { IItemDataResource } from '../../../../blockly/fields/stamps-field.js';
import { FieldPicker } from '../../../../blockly/fields/field-picker.js';
import KanoCodeChallenge from '../kano-code.js';
import { IStepData } from '../../../../creator/creator.js';

export class QuotePickerFieldStepHelper extends IndexedPickerFieldStepHelper {

    testCase(challenge: KanoCodeChallenge, step: IStepData) {
        const field = this.getField(challenge, step);
        return field && field.constructor === FieldPicker;
    }

    getItem(value: string, targetItems?: IItemDataResource[], ) {
        const shadow = this.getShadowElement();
        if (!shadow || !targetItems) {
            return;
        }
        const id = this.getIdFromValue(value, targetItems);
        const items = shadow.querySelectorAll('.item');
        const item = Array.from(items).find(item => item.id === id) as HTMLElement;
        return item;
    }
}