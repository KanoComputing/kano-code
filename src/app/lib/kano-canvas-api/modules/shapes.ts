import { Utils, ISession } from '../utils.js';

export class Shapes {
    private session : ISession;
    constructor(session : ISession) {
        this.session = session;
    }
    /*
    * Draw a rectangle using current cursor position as origin
    *
    * @param {Number} width
    * @param {Number} height
    * @return void
    */
    rectangle(width : number, height : number) {
        var x, y;
        Utils.startShape(this.session);

        x = this.session.pos.x * this.session.ratio;
        y = this.session.pos.y * this.session.ratio;

        width *= this.session.ratio;
        height *= this.session.ratio;

        this.session.ctx.rect(x, y, width, height);
        Utils.endShape(this.session);
    };

    /*
    * Draw a square using current cursor position as origin
    *
    * @param {Number} size
    * @return void
    */
    square(size : number) {
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
    drawArc(rx : number, ry : number, start : number, end : number, close? : boolean, back? : boolean) {
        var x, y, startingAngle, endingAngle;
        Utils.startShape(this.session);

        x = this.session.pos.x * this.session.ratio;
        y = this.session.pos.y * this.session.ratio;

        rx *= this.session.ratio;
        ry *= this.session.ratio;

        startingAngle = start * Math.PI;
        endingAngle = end * Math.PI; // 360 degrees is equal to 2π radians

        this.session.ctx.save();
        this.session.ctx.translate(x, y);
        this.session.ctx.scale(rx, ry);
        this.session.ctx.arc(0, 0, 1, startingAngle, endingAngle, false);
        this.session.ctx.restore();

        Utils.endShape(this.session, close, back);
    };

    /*
    * Draw an ellipse using current cursor position as origin
    *
    * @param {Number} rx
    * @param {Number} ry
    * @return void
    */
    ellipse(rx : number, ry : number) {
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
    arc(radius : number, start : number, end : number, close? : boolean) {
        this.drawArc(radius, radius, start, end, close || false, close || false);
    };

    /*
    * Draw a circle using current cursor position as origin
    *
    * @param {Number} radius
    * @return void
    */
    circle(radius : number) {
        this.ellipse(radius, radius);
    };

    /*
    * Draw a polygon using every two arguments as coordinates for a new point
    *
    * @param {Number} radius
    * @return void
    */
    polygon() {
        var lastArg = arguments[arguments.length - 1],
            close = lastArg === true || lastArg === false ? lastArg : false,
            baseX = this.session.pos.x * this.session.ratio,
            baseY = this.session.pos.y * this.session.ratio,
            points = [],
            i;

        Utils.startShape(this.session);
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
        Utils.endShape(this.session, close);
    };

    /*
    * Draw a single pixel with no stroke using current cursor position as origin
    *
    * @return void
    */
    pixel() {
        var x = this.session.pos.x * this.session.ratio,
            y = this.session.pos.y * this.session.ratio;
        this.session.ctx.save();
        this.session.ctx.lineWidth = 0;
        this.session.ctx.fillStyle = this.session.settings.fill;
        this.session.ctx.fillRect(x, y, 1, 1);
        this.session.ctx.restore();
    };
}

export default Shapes;
