import { DataPart } from '../data/data.js';
import { part } from '../../decorators.js';
import { transformLegacyWeather } from './legacy.js';
import { join } from '../../../util/path.js';

const emojiMap : { [K : string] : string } = {
    '01d': '\u2600\uFE0F',
    '02d': '\uD83C\uDF24',
    '03d': '\uD83C\uDF25',
    '04d': '\u2601\uFE0F',
    '09d': '\uD83C\uDF27',
    '10d': '\uD83C\uDF26',
    '11d': '\u26C8 ',
    '13d': '\uD83C\uDF28',
    '50d': '\uD83C\uDF2B',
};

interface IWeatherData {
    base : string;
    clouds : { all : number };
    cod : 200;
    coord : { long : number, lat : number };
    dt : number;
    id : number;
    main : {
        humidity : number;
        pressure : number;
        temp : number;
        temp_max : number;
        temp_min : number;
    };
    name : string;
    sys : {
        country : string;
        id : number;
        message : number;
        sunrise : number;
        sunset : number;
        type : number;
    };
    visibility : number;
    weather : {
        description : string;
        icon : string;
        id : number;
        main : string;
    }[];
    wind : { speed : number, deg : number };
}

enum WeatherType {
    CLOUDY = 'cloudy',
    RAINY = 'rainy',
    SUNNY = 'sunny',
    SNOWY = 'snowy',
}

@part('weather')
export class WeatherPart extends DataPart<IWeatherData> {
    public _location : string = 'London, U.K.';
    public _units : 'metric'|'imperial' = 'metric';
    static get defaultLocation() { return 'London, U.K.' }
    static transformLegacy(app : any) {
        transformLegacyWeather(app);
    }
    query() : Promise<IWeatherData> {
        const url = join(DataPart.getBaseUrl(), `/weather-city/?q=${encodeURIComponent(this._location)}&units=${encodeURIComponent(this._units)}`);
        return fetch(url)
            .then(r => r.json())
            .then((r) => {
                return r.value as IWeatherData;
            });
    }
    is(type : WeatherType) : boolean {
        if (!this.value) {
            return false;
        }
        const weather = this.value.weather[0];
        if (!weather) {
            return false;
        }
        switch (type) {
            case WeatherType.SUNNY: {
                return weather.id === 800;
            }
            case WeatherType.RAINY: {
                return weather.id >= 500 && weather.id < 600;
            }
            case WeatherType.SNOWY: {
                return weather.id >= 600 && weather.id < 700;
            }
            case WeatherType.CLOUDY: {
                return weather.id >= 801 && weather.id < 900;
            }
        }
    }
    get temperature() {
        if (!this.value) {
            return NaN;
        }
        return this.value.main.temp;
    }
    get windSpeed() {
        if (!this.value) {
            return NaN;
        }
        return this.value.wind.speed;
    }
    get windDirection() {
        if (!this.value) {
            return NaN;
        }
        return this.value.wind.deg;
    }
    get clouds() {
        if (!this.value) {
            return NaN;
        }
        return this.value.clouds.all;
    }
    get emoji() {
        if (!this.value) {
            return '\u2600\uFE0F';
        }
        const weather = this.value.weather[0];
        if (!weather) {
            return false;
        }
        let icon = weather.icon ? weather.icon : '01d';
        return emojiMap[icon] || '\u2600\uFE0F';
    }
    set location(v : string) {
        this._location = v;
    }
    get location() {
        return WeatherPart.defaultLocation;
    }
    serialize() {
        const data = super.serialize();
        data.units = this._units;
        return data;
    }
    load(data : any) {
        super.load(data);
        this._units = data.units || 'metric';
    }
}