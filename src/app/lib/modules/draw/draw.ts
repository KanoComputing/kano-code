import { AppModule } from '../../app-modules/app-module.js';
import { Canvas } from './kano-canvas-api/kano-canvas-api.js';
import Output from '../../output/output.js';
import { transformLegacy } from './legacy.js';

export class DrawModule extends AppModule {
    constructor(output : Output) {
        super(output);
        this.addLifecycleStep('start', '_start');
    }
    static transformLegacy(app : any) {
        transformLegacy(app);
    }
    static get id() {
        return 'ctx';
    }
    _start() {
        const { canvas } = this.output.visuals;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }
        ctx.globalAlpha = 1;
        this.modules = new Canvas({
            ctx,
            width: this.output.visuals.width,
            height: this.output.visuals.height,
        });

        const draw = this;

        this.methods = {
            lineTo: this.modules.paths.lineTo.bind(this.modules.paths),
            line: this.modules.paths.line.bind(this.modules.paths),
            color: this.modules.setters.color.bind(this.modules.setters),
            stroke: this.modules.setters.stroke.bind(this.modules.setters),
            circle: this.modules.shapes.circle.bind(this.modules.shapes),
            ellipse: this.modules.shapes.ellipse.bind(this.modules.shapes),
            square: this.modules.shapes.square.bind(this.modules.shapes),
            rectangle: this.modules.shapes.rectangle.bind(this.modules.shapes),
            arc: this.modules.shapes.arc.bind(this.modules.shapes),
            polygon: this.modules.shapes.polygon.bind(this.modules.shapes),
            pixel: this.modules.shapes.pixel.bind(this.modules.shapes),
            moveTo: this.modules.space.moveTo.bind(this.modules.space),
            moveToRandom: this.modules.space.moveToRandom.bind(this.modules.space),
            move: this.modules.space.move.bind(this.modules.space),
            reset: this.modules.general.reset.bind(this.modules.general),
            repeatDrawing: this.modules.repeats.repeatDrawing.bind(this.modules.repeats),
            set opacity(a : number) {
                a = Math.max(0, Math.min(100, a));
                ctx!.globalAlpha = a / 100;
            },
            set background (c : string) {
                draw.modules.general.background(c);
            },
        };

        // TODO: Design a better thing here. Extend the draw module probably
        // this.methods = Object.assign(provider.getAdditionalMethods(), this.methods);
    }
}

export default DrawModule;
