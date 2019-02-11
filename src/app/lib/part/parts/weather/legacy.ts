import { LegacyUtil } from '../../../legacy/util.js';
import { transformLegacyDataPart } from '../data/legacy.js';
import { WeatherPart } from './weather.js';

export function transformLegacyWeather(app : any) {
    transformLegacyDataPart(WeatherPart.type, app);
    if (!app.parts || !app.source) {
        return;
    }
    const root = LegacyUtil.getDOM(app.source);
    if (root) {
        LegacyUtil.forEachPart(app, WeatherPart.type, ({ id }) => {
            // TODO: Fill
        });
        const serializer = new XMLSerializer();
        app.source = serializer.serializeToString(root);
    }
}