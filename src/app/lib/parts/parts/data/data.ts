import { Part } from '../../part.js';
import { PartComponent } from '../../component.js';
import { EventEmitter } from '@kano/common/index.js';
import { property, component } from '../../decorators.js';
import { throttle } from '../../../decorators.js';

class DataComponent extends PartComponent {
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public updated : EventEmitter = new EventEmitter();
}

export abstract class DataPart<T> extends Part {
    @component(DataComponent)
    public data : DataComponent;
    protected value : T|null = null;
    constructor() {
        super();
        this.data = this._components.get('data') as DataComponent;
    }
    @throttle(1000, true)
    refresh() {
        return this.query()
            .then((data) => {
                this.value = data;
                this.data.updated.fire();
            });
    }
    onStop() {
        super.onStop();
        this.value = null;
    }
    onUpdate(callback : () => void) {
        this.data.updated.event(callback, null, this.userSubscriptions);
    }
    abstract query() : Promise<T>
}
