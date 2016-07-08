(function (Kano) {

    function Canvas(settings) {
        this.session = {};
        this.general = new Kano.CanvasAPI.General(this.session);
        this.palette = Kano.CanvasAPI.Palette;
        this.paths = new Kano.CanvasAPI.Paths(this.session);
        this.setters = new Kano.CanvasAPI.Setters(this.session);
        this.shapes = new Kano.CanvasAPI.Shapes(this.session);
        this.space = new Kano.CanvasAPI.Space(this.session);
        this.text = new Kano.CanvasAPI.Text(this.session);
        this.reset(settings);
    }

    Canvas.prototype.reset = function (settings) {
        this.session.ctx = settings.ctx;
        this.session.width = settings.width;
        this.session.height = settings.height;
        this.session.ratio = settings.ratio || 1;
        this.session.pos = {
            x: settings.width / 2,
            y: settings.height / 2
        };
        this.general.reset();
        this.space.moveTo(this.session.pos.x, this.session.pos.y);
        this.setters.strokeColor(this.session.settings.stroke.color);
        this.setters.strokeWidth(this.session.settings.stroke.width);
        this.paths.lineCap(this.session.settings.stroke.cap);
        this.text.updateFont();
    };

    Kano.CanvasAPI = Canvas;
})(window.Kano = window.Kano || {});
