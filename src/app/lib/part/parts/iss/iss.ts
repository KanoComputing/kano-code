import { DataPart } from '../data/data.js';
import { part } from '../../decorators.js';
import { transformLegacy } from './legacy.js';

interface ISSData {
    altitude : number;
    daynum : number;
    footprint : number;
    id : number;
    latitude : number;
    longitude : number;
    name: string;
    solar_lat : number;
    solar_lon : number;
    timestamp : number;
    units: string;
    velocity : number;
    visibility: string;
}

@part('iss')
export class ISSPart extends DataPart<ISSData> {
    static transformLegacy(app : any) {
        transformLegacy(app);
    }
    query() : Promise<ISSData> {
        return this.fetch(() => {
            return fetch('https://apps-data.kano.me/data-src/iss/')
                .then(r => r.json())
                .then((r) => {
                    return r.value as ISSData;
                });
        });
    }
    get latitude() {
        return this.value.latitude;
    }
    get longitude() {
        return this.value.latitude;
    }
}