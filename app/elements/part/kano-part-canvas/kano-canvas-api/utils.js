(function (Kano) {
    Kano.CanvasAPI.Utils = {};

    /*
    * Begin a vector shape path on current context
    *
    * @return void
    */
    Kano.CanvasAPI.Utils.startShape = function (session) {
        session.ctx.beginPath();
    };

    /*
    * End a vector shape path on current context, close and bring back to origin
    *
    * if specified
    * @param {Boolean} close
    * @param {Boolean} back
    * @return void
    */
    Kano.CanvasAPI.Utils.endShape = function (session, close, back) {
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
    };

    /*
    * Parse stroke attributes from string and return stroke settings object
    *
    * @param {Boolean} close
    * @return {Object}
    */
    Kano.CanvasAPI.Utils.parseLineStyle = function (attributes) {
        var out = {},
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
    };

    /*
    * Parse or evaluate a coordinate from string or number
    *
    * @param {String|Number} val
    * @param {String} type
    * @return {Number}
    */
    Kano.CanvasAPI.Utils.parseCoordinate = function (session, val, type) {
        type = type || 'x';

        if (typeof val === 'string') {
            if (type === 'x') {
                switch (val) {
                    case 'center':
                        return Kano.CanvasAPI.Utils.getCenter().x;
                    case 'right':
                        return session.width;
                    case 'left':
                        return 0;
                }
            } else if (type === 'y') {
                switch (val) {
                    case 'center':
                        return Kano.CanvasAPI.Utils.getCenter().y;
                    case 'bottom':
                        return session.height;
                    case 'top':
                        return 0;
                }
            }
        }

        return val;
    };

    /*
    * Parse a pair of x / y coordinates
    *
    * @param {String|Number} x
    * @param {String|Number} y
    * @return {Object}
    */
    Kano.CanvasAPI.Utils.parseCoordinates = function (session, x, y) {
        x = Kano.CanvasAPI.Utils.parseCoordinate(session, x, 'x');
        y = Kano.CanvasAPI.Utils.parseCoordinate(session, y, 'y');

        return { x: x, y: y };
    };

    /*
    * Get stage center in current session
    *
    * @return {Object}
    */
    Kano.CanvasAPI.Utils.getCenter = function (session) {
        return {
            x : session.width / 2,
            y : session.height / 2
        };
    };

    /*
    * Get a color from palette if it's an existing key or just return
    *
    * @param {String} val
    * @return void
    */
    Kano.CanvasAPI.Utils.parseColor = function (val) {
        return Kano.CanvasAPI.Palette[val] || val;
    };

    /*
    * Given value is a valid color
    *
    * @param {*} val
    * @return {Boolean}
    */
    Kano.CanvasAPI.Utils.isColorValue = function (val) {
        if (typeof val !== 'string') {
            return false;
        }

        if (val.substr(0, 1) === '#' && val.length > 3 && val.length <= 7) {
            return true;
        } else if (Kano.CanvasAPI.Palette[val]) {
            return true;
        }

        return false;
    };

})(window.Kano = window.Kano || {});
