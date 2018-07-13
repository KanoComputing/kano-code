import '../../node_modules/tracking/build/tracking.js';
import * as code from '../../app/lib/index.js';
import { DrawModule } from '../simple/profile.js';

// Define what the output will be, In this case, the video output
class TrackingOutputView extends code.OutputViewProvider {
    constructor(...args) {
        super(...args);
        this.root = document.createElement('div');
        this.root.style.width = '600px';
        this.root.style.height = '450px';
        this.root.style.position = 'relative';
        this.root.innerHTML = `
            <style>
                #video, #canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }    
            </style>
            <video id="video" width="600" height="450" preload autoplay loop muted controls></video>
            <canvas id="canvas" width="600" height="450"></canvas>
        `;
        this.tracker = new tracking.ColorTracker();
        tracking.track(this.root.querySelector('#video'), this.tracker, { camera: true });
        this.canvas = this.root.querySelector('#canvas');
    }
    // Every time the output restarts, resets all values
    start() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

class TrackModule extends code.AppModule {
    static get name() { return 'track'; }
    constructor(...args) {
        super(...args);
        this.addMethod('onColor', '_onColor');
        this.addLifecycleStep('start', '_start');
        this.addLifecycleStep('stop', '_stop');
        this.onTrack = (e) => {
            e.data.forEach((event) => {
                const match = this.colors.get(event.color);
                if (!match) {
                    return;
                }
                event.color = match.color;
                match.callback(event);
            });
        };
    }
    _start() {
        const { outputView } = this.output;
        this.colors = new Map();
        this.counter = 0;
        outputView.tracker.on('track', this.onTrack);
    }
    _stop() {
        const { outputView } = this.output;
        outputView.tracker.removeListener('track', this.onTrack);
    }
    _onColor(color, callback) {
        const { outputView } = this.output;
        const id = this.counter;
        this.counter += 1;
        this.colors.set(id, { id, color, callback });
        TrackModule.createCustomColor(id, color);
        outputView.tracker.setColors(Array.from(this.colors.keys()));
    }
    static createCustomColor(id, value) {
        const components = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(value);
        const customColorR = parseInt(components[1], 16);
        const customColorG = parseInt(components[2], 16);
        const customColorB = parseInt(components[3], 16);

        const colorTotal = customColorR + customColorG + customColorB;

        if (colorTotal === 0) {
            tracking.ColorTracker.registerColor(id, (r, g, b) => r + g + b < 10);
        } else {
            const rRatio = customColorR / colorTotal;
            const gRatio = customColorG / colorTotal;

            tracking.ColorTracker.registerColor(id, (r, g, b) => {
                const colorTotal2 = r + g + b;

                if (colorTotal2 === 0) {
                    if (colorTotal < 10) {
                        return true;
                    }
                    return false;
                }

                const rRatio2 = r / colorTotal2;
                const gRatio2 = g / colorTotal2;
                const deltaColorTotal = colorTotal / colorTotal2;
                const deltaR = rRatio / rRatio2;
                const deltaG = gRatio / gRatio2;

                return deltaColorTotal > 0.9 && deltaColorTotal < 1.1 &&
            deltaR > 0.9 && deltaR < 1.1 &&
            deltaG > 0.9 && deltaG < 1.1;
            });
        }
    }
}

export class TrackingOutputProfile extends code.OutputProfile {
    get id() { return 'tracking'; }
    get outputViewProvider() { return new TrackingOutputView(); }
    get modules() {
        return [TrackModule, DrawModule];
    }
}

export default TrackingOutputProfile;
