(function (Kano) {
    function Setters(session) {
        this.session = session;
    }

    /*
    * Set current this.session stroke color
    *
    * @param {String} color
    * @return void
    */
    Setters.prototype.strokeColor = function (color) {
        color = Kano.CanvasAPI.Utils.parseColor(color);
        this.session.settings.stroke.color = color;
        this.session.ctx.strokeStyle = color;
    };

    /*
    * Set current this.session stroke width
    *
    * @param {Number} val
    * @return void
    */
    Setters.prototype.strokeWidth = function (val) {
        this.session.settings.stroke.width = val;
        this.session.ctx.lineWidth = val * this.session.ratio;
    };

    /*
    * Set current this.session mixed stroke attributes
    *
    * @param {*...} attributes
    * @return void
    */
    Setters.prototype.stroke = function () {
        var style = Kano.CanvasAPI.Utils.parseLineStyle(arguments);
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
    Setters.prototype.color = function (val) {
        val = Kano.CanvasAPI.Utils.parseColor(val);
        this.session.settings.fill = val || 'transparent';
    };

    Kano.CanvasAPI.Setters = Setters;

})(window.Kano = window.Kano || {});
