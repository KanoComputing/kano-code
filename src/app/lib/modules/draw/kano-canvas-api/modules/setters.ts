import { Utils, ISession } from '../utils.js';

export class Setters {
    private session : ISession;
    constructor(session : ISession) {
        this.session = session;
    }
    /*
    * Set current this.session stroke color
    *
    * @param {String} color
    * @return void
    */
    strokeColor(color : string) {
        color = Utils.parseColor(color);
        this.session.settings.stroke.color = color;
        this.session.ctx.strokeStyle = color;
    };

    /*
    * Set current this.session stroke width
    *
    * @param {Number} val
    * @return void
    */
    strokeWidth(val : number) {
        this.session.settings.stroke.width = val;
        this.session.ctx.lineWidth = val * this.session.ratio;
    };

    /*
    * Set current this.session mixed stroke attributes
    *
    * @param {*...} attributes
    * @return void
    */
    stroke(...attributes : (string|number)[]) {
        var style = Utils.parseLineStyle(attributes);
        if (style.color) {
            this.strokeColor(style.color);
        }
        if (typeof style.width !== 'undefined') {
            this.strokeWidth(style.width);
        }
    };

    /*
    * Set current this.session fill color
    *
    * @param {String} color
    * @return void
    */
    color(val : string) {
        val = Utils.parseColor(val);
        this.session.settings.fill = val || 'transparent';
    };
}

export default Setters;
