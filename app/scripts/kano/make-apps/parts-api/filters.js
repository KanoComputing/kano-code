import { Base } from './base.js';
import './canvas-filters.js';

const FiltersAPI = {
    start () {
        Base.start.apply(this, arguments);
        this._filters = [];
    },
    _getWorker() {
        if (this._worker) {
            return this._worker;
        }
        return this._worker = new Worker('/scripts/kano/make-apps/parts-api/canvas-filters.js');
    },
    addFilter (name, args) {
        this._filters = this._filters || [];
        this._filters.push({ name, args: args || [] });
    },
    clearFilters () {
        this._filters = [];
    },
    applyFilters (canvas) {
        this._filters = this._filters || {};
        return new Promise((resolve, reject) => {
            let p,
                worker = this._getWorker(),
                listener,
                filters;
            if (!canvas) {
                return resolve();
            }
            if (!this._filters.length) {
                return resolve(canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height));
            }
            p = Filters.getPixels(canvas);
            listener = (res) => {
                worker.removeEventListener('message', listener);
                resolve(Filters.toImageData(res.data));
            };
            filters = this._filters.map((filter, index) => {
                let f = {
                    name: filter.name,
                    args: filter.args.slice(0)
                };
                if (index === 0) {
                    f.args.unshift(p);
                }
                return f;
            });
            worker.postMessage({ name: 'runPipeline', args: [filters] });
            worker.addEventListener('message', listener);
        });
    },
    stop () {
        Base.stop.apply(this, arguments);
        this._filters = [];
    }
};

/**
 * @polymerBehavior
 */
export const filters = Object.assign({}, Base, FiltersAPI);
