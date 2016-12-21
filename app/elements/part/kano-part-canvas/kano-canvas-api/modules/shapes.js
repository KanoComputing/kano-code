(function (Kano) {
    function Shapes(session) {
        this.session = session;
    }

    /*
    * Draw a rectangle using current cursor position as origin
    *
    * @param {Number} width
    * @param {Number} height
    * @return void
    */
    Shapes.prototype.rectangle = function (width, height) {
        var x, y;
        Kano.CanvasAPI.Utils.startShape(this.session);

        x = this.session.pos.x * this.session.ratio;
        y = this.session.pos.y * this.session.ratio;

        width *= this.session.ratio;
        height *= this.session.ratio;

        this.session.ctx.rect(x, y, width, height);
        Kano.CanvasAPI.Utils.endShape(this.session);
    };

    /*
    * Draw a square using current cursor position as origin
    *
    * @param {Number} size
    * @return void
    */
    Shapes.prototype.square = function (size) {
        this.rectangle(size, size);
    };

    /*
    * Base function to draw an arc using current cursor position as origin, rx
    * and ry as x and y radiuses, start and end values ranging from 0 to 2,
    * close back for path creation.
    * This function is used as a base for other functions in this module
    *
    * @param {Number} rx
    * @param {Number} ry
    * @param {Number} start
    * @param {Number} end
    * @param {Boolean} close
    * @param {Boolean} back
    * @return void
    */
    Shapes.prototype.drawArc = function (rx, ry, start, end, close, back) {
        var x, y, startingAngle, endingAngle;
        Kano.CanvasAPI.Utils.startShape(this.session);

        x = this.session.pos.x * this.session.ratio;
        y = this.session.pos.y * this.session.ratio;

        rx *= this.session.ratio;
        ry *= this.session.ratio;

        startingAngle = start * Math.PI;
        endingAngle = end * Math.PI; // 360 degrees is equal to 2π radians

        this.session.ctx.save();
        this.session.ctx.translate(x, y);
        this.session.ctx.scale(rx, ry);
        this.session.ctx.arc(0, 0, 1, startingAngle, endingAngle, -1);
        this.session.ctx.restore();

        Kano.CanvasAPI.Utils.endShape(this.session, close, back);
    };

    /*
    * Draw an ellipse using current cursor position as origin
    *
    * @param {Number} rx
    * @param {Number} ry
    * @return void
    */
    Shapes.prototype.ellipse = function (rx, ry) {
        this.drawArc(rx, ry, 0, 2);
    };

    /*
    * Simplified wrapper function to draw an arc
    *
    * @param {Number} radius
    * @param {Number} start
    * @param {Number} end
    * @param {Boolean} close
    * @return void
    */
    Shapes.prototype.arc = function (radius, start, end, close) {
        this.drawArc(radius, radius, start, end, close || false, close || false);
    };

    /*
    * Draw a circle using current cursor position as origin
    *
    * @param {Number} radius
    * @return void
    */
    Shapes.prototype.circle = function (radius) {
        this.ellipse(radius, radius);
    };

    /*
    * Draw a polygon using every two arguments as coordinates for a new point
    *
    * @param {Number} radius
    * @return void
    */
    Shapes.prototype.polygon = function () {
        var lastArg = arguments[arguments.length - 1],
            close = lastArg === true || lastArg === false ? lastArg : false,
            baseX = this.session.pos.x * this.session.ratio,
            baseY = this.session.pos.y * this.session.ratio,
            points = [],
            i;

        Kano.CanvasAPI.Utils.startShape(this.session);
        this.session.ctx.save();
        this.session.ctx.lineTo(baseX, baseY);

        points.push({ x: 0, y: 0 });

        for (i = 0; i < arguments.length; i += 2) {
            this.session.ctx.lineTo(
                baseX + arguments[i] * this.session.ratio,
                baseY + arguments[i + 1] * this.session.ratio
            );
            points.push({ x: arguments[i], y: arguments[i + 1] });
        }
        this.session.ctx.restore();
        Kano.CanvasAPI.Utils.endShape(this.session, close);
    };

    /*
    * Draw a single pixel with no stroke using current cursor position as origin
    *
    * @return void
    */
    Shapes.prototype.pixel = function () {
        var x = this.session.pos.x * this.session.ratio,
            y = this.session.pos.y * this.session.ratio;
        this.session.ctx.save();
        this.session.ctx.lineWidth = 0;
        this.session.ctx.fillStyle = this.session.settings.fill;
        this.session.ctx.fillRect(x, y, 1, 1);
        this.session.ctx.restore();
    };

    Kano.CanvasAPI.Shapes = Shapes;

})(window.Kano = window.Kano || {});
