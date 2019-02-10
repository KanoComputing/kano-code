import { Part } from '../../part.js';
import { part } from '../../decorators.js';
import { transformLegacyClock } from './legacy.js';

type IDateKey = 'year'|'month'|'day'|'hour'|'minute'|'seconds'|'milliseconds';

@part('clock')
export class ClockPart extends Part {
    static transformLegacy(app : any) {
        transformLegacyClock(app);
    }
    getCurrent(key : IDateKey) : number {
        const date = new Date();
        switch (key) {
            case 'year': {
                return date.getFullYear();
            }
            case 'month': {
                return date.getMonth() + 1;
            }
            case 'day': {
                return date.getDate();
            }
            case 'hour': {
                return date.getHours();
            }
            case 'minute': {
                return date.getMinutes();
            }
            case 'seconds': {
                return date.getSeconds();
            }
            case 'milliseconds': {
                return date.getMilliseconds();
            }
        }
    }
    get(key : 'date'|'time') : string {
        if (key === 'date') {
            return (new Date()).toLocaleDateString();
        }
        return (new Date()).toLocaleTimeString();
    }
}

export default ClockPart;
