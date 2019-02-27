import { Part } from '../../part.js';
import { PartComponent } from '../../component.js';
import { EventEmitter } from '@kano/common/index.js';
import { property, component } from '../../decorators.js';
import { throttle } from '../../../decorators.js';
import Output from '../../../output/output.js';

class DataComponent extends PartComponent {
    @property({ type: EventEmitter, value: new EventEmitter(), noReset: true })
    public updated : EventEmitter = new EventEmitter();
}

const DATA_BASE_URL_KEY = 'data:base-url';

export abstract class DataPart<T> extends Part {
    @component(DataComponent)
    public data : DataComponent;
    protected value : T|null = null;
    constructor() {
        super();
        this.data = this._components.get('data') as DataComponent;
    }
    static getBaseUrl() {
        return Output.config.get(DATA_BASE_URL_KEY, 'https://apps-data.kano.me/data-src/');
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
