import { Base } from './base.js';

const Data = {
    start () {
        Base.start.apply(this, arguments);
        let model = this.model;
        if (model.refreshEnabled) {
            this.refreshInterval = setInterval(this.refresh.bind(this), Math.max(1, model.refreshFreq) * 1000);
        }
        // Call a refresh at the begining
        this.refresh();
    },
    stop () {
        Base.stop.apply(this, arguments);
        clearInterval(this.refreshInterval);
    },
    refresh () {
        return this.appModules.getModule('data').generateRequest(this.model.id, this.model.method, this.model.config)
            .then((data) => {
                this.set('model.data', data);
                this.fire('update');
                this.set('model.connected', true);
            }).catch((e) => {
                this.set('model.connected', false);
            });
    },
    setConfig (name, value) {
        this.set(`model.config.${name}`, value);
        this.refresh();
    },
    getValue (path) {
        return this.get(`model.data.${path}`) || this.get(`model.config.${path}`);
    },
    getData () {
        return this.get('model.data');
    }
};

/**
 * @polymerBehavior
 */
export const data = Object.assign({}, Base, Data);
