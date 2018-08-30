import AppModule from './app-module.js';
import { Canvas } from '../kano-canvas-api/kano-canvas-api.js';

export const DrawModuleFactory = (provider) => {
    return class DrawModule extends AppModule {
        constructor(output) {
            super(output);
            this.addLifecycleStep('start', '_start');
        }
        static get id() {
            return 'ctx';
        }
        _start() {
            let canvas = provider.getCanvas();
            while ('canvas' in canvas) {
                canvas = canvas.canvas;
            };
            this.modules = new Canvas({
                ctx: canvas.getContext('2d'),
                width: canvas.width,
                height: canvas.height,
            });

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
            };

            this.methods = Object.assign(provider.getAdditionalMethods(), this.methods);
        }
    }
}

export default DrawModuleFactory;
