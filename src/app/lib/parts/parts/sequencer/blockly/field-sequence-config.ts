import { Blockly } from '@kano/kwc-blockly/blockly.js';
import { KCSequenceConfig } from '../components/kc-sequence-config.js';
import { FieldSequence } from './field-sequence.js';

export class FieldSequenceConfig extends Blockly.FieldConfig {
    private customEl? : KCSequenceConfig;
    private title : string;
    constructor(title : string, value : number, optValidator? : () => void) {
        super(value.toString(), optValidator);
        this.title = title;
    }
    showEditor_() {
        Blockly.WidgetDiv.show(this, this.sourceBlock_.RTL, FieldSequenceConfig.widgetDispose_);
    
        const div = Blockly.WidgetDiv.DIV;
    
        this.customEl = new KCSequenceConfig();
        this.customEl.title = this.title;
        this.customEl.value = parseInt(this.getValue(), 10);

        const sequenceField = this.sourceBlock_.getField('SEQUENCE') as FieldSequence;

        if (!sequenceField) {
            return;
        }
    
        this.customEl.addEventListener('change', ((e : CustomEvent) => {
            sequenceField.setSize(e.detail);
            this.setValue(e.detail.toString());
        }) as EventListener);
    
        div.appendChild(this.customEl);
        this.customEl.updateComplete.then(() => {
            this.position();
        });
    }
    static widgetDispose_() {}
}
