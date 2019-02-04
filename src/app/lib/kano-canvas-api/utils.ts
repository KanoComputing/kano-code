import { Palette } from './modules/palette.js';

export interface ISession {
    ctx : CanvasRenderingContext2D;
    pos : { x : number, y : number };
    ratio : number;
    width : number;
    height : number;
    settings : {
        bg : string|null;
        stroke : {
            width : number;
            color : string;
            cap : CanvasLineCap;
        }
        fill : string;
        text : {
            size : number;
            italic : boolean;
            bold : boolean;
            font : string;
            align : CanvasTextAlign;
            baseline : CanvasTextBaseline;
        }
    }
}

export const Utils = {

    /*
    * Begin a vector shape path on current context
    *
    * @return void
    */
    startShape(session : ISession) {
        session.ctx.beginPath();
    },
    /*
    * End a vector shape path on current context, close and bring back to origin
    *
    * if specified
    * @param {Boolean} close
    * @param {Boolean} back
    * @return void
    */
    endShape(session : ISession, close? : boolean, back? : boolean) {
        close = typeof close === 'undefined' ? true : close;

        if (back) {
            session.ctx.lineTo(session.pos.x * session.ratio, session.pos.y * session.ratio);
        }

        if (close) {
            session.ctx.closePath();
        }

        if (session.settings.stroke.width) {
            session.ctx.stroke();
        }

        session.ctx.fillStyle = session.settings.fill;
        session.ctx.fill();
    },
    /*
    * Parse stroke attributes from string and return stroke settings object
    *
    * @param {Boolean} close
    * @return {Object}
    */
    parseLineStyle(attributes : string|number[]) {
        var out : { width? : number, color? : string } = {},
        i, attr;

        for (i = 0 ; i < attributes.length; i += 1) {
            attr = attributes[i];

            if (typeof attr === 'number') {
                out.width = attr;
            } else {
                out.color = attr;
            }
        }

        return out;
    },
    isString(val : any) : val is string {
        return typeof val === 'string';
    },
    isNumber(val : any) : val is number {
        return typeof val === 'number';
    },
    /*
    * Parse or evaluate a coordinate from string or number
    *
    * @param {String|Number} val
    * @param {String} type
    * @return {Number}
    */
    parseCoordinate(session : ISession, val : string|number, type : string) : number {
        type = type || 'x';

        if (Utils.isString(val)) {
            if (type === 'x') {
                switch (val) {
                    case 'center':
                        return Utils.getCenter(session).x;
                    case 'right':
                        return session.width;
                    case 'left':
                        return 0;
                }
            } else if (type === 'y') {
                switch (val) {
                    case 'center':
                        return Utils.getCenter(session).y;
                    case 'bottom':
                        return session.height;
                    case 'top':
                        return 0;
                }
            }
        } else if (Utils.isNumber(val)) {
            return val;
        }
        return 0;
    },
    /*
    * Parse a pair of x / y coordinates
    *
    * @param {String|Number} x
    * @param {String|Number} y
    * @return {Object}
    */
    parseCoordinates(session : ISession, x : string|number, y : string|number) {
        const newX = Utils.parseCoordinate(session, x, 'x');
        const newY = Utils.parseCoordinate(session, y, 'y');

        return { x: newX, y: newY };
    },
    /*
    * Get stage center in current session
    *
    * @return {Object}
    */
    getCenter(session : ISession) {
        return {
            x : session.width / 2,
            y : session.height / 2
        };
    },
    /*
    * Get a color from palette if it's an existing key or just return
    *
    * @param {String} val
    * @return void
    */
    parseColor(val : string) {
        return Palette[val] || val;
    },
    /*
    * Given value is a valid color
    *
    * @param {*} val
    * @return {Boolean}
    */
    isColorValue(val : string) {
        if (typeof val !== 'string') {
            return false;
        }

        if (val.substr(0, 1) === '#' && val.length > 3 && val.length <= 7) {
            return true;
        } else if (Palette[val]) {
            return true;
        }

        return false;
    },
};
