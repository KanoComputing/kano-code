import 'omggif/omggif.js';

class GifEncoder {
    constructor (opts) {
        this.generating = false;

        this.lastJobId = 0;

        this.workerUrl = opts.workerUrl || GifEncoder.WORKER_URL;

        this.width = Math.floor(opts.width);
        this.height = Math.floor(opts.height);
        this.length = opts.length;
        this.workerPoolSize = opts.workerPoolSize || window.navigator.hardwareConcurrency;

        this.queue = [];
        this.frames = [];

        this.workerPool = [];
        for(let i = 0; i < this.workerPoolSize; i++) {
            this.workerPool.push({
                worker: new Worker(this.workerUrl),
                inUse: false
            });
        }
    }

    static get WORKER_URL () {
        return '/libs/QuantWorker.js';
    }

    addFrame (context, delay) {
        // Add the frame to the queue
        this.queue.push({ context, delay, i: this.frames.length });
        // Keep a slot for the frame
        this.frames.push(null);
        this.tick();
    }

    tick () {
        let nextInQueue;
        if (!this.queue.length) {
            // Don't end here if there are frames left to render
            for (let i = 0; i < this.frames.length; i++) {
                if (!this.frames[i]) {
                    return;
                }
            }
            if (typeof this.finishedQueue === 'function') {
                this.finishedQueue();
                this.finishedQueue = null;
            }
            return;
        }
        nextInQueue = this.queue[0];
        for (let i = 0; i < this.workerPool.length; i++) {
            if (!this.workerPool[i].inUse) {
                this.workerPool[i].inUse = true;
                this.renderFrame(nextInQueue.context, nextInQueue.delay, nextInQueue.i, this.workerPool[i].worker)
                    .then(() => {
                        this.workerPool[i].inUse = false;
                        this.tick();
                    });
                this.queue.shift();
                return;
            }
        }
    }

    renderFrame (context, delay, i, worker) {
        return new Promise((resolve, reject) => {
            let frameContext = context.getImageData(0, 0, this.width, this.height),
                frameData = frameContext.data,
                frameJobId = i,
                onCompletion;

            onCompletion = (e) => {
                if (e.data.job_id === frameJobId) {
                    let pixels_for_gif = e.data.pixels_for_gif,
                        palette = e.data.palette;
                    this.frames[i] = {
                        pixels: pixels_for_gif,
                        duration: e.data.job_duration,
                        palette,
                        delay
                    };
                    worker.removeEventListener('message', onCompletion);
                    resolve();
                }
            };

            worker.addEventListener('message', onCompletion);

            worker.postMessage({
                job_id: frameJobId,
                width: this.width,
                height: this.height,
                frameData: frameData
            });
        });
    }

    end () {
        return new Promise((resolve, reject) => {
            this.finishedQueue = () => {
                let string = '',
                    buffer;

                this.buffer = new Uint8Array(this.width * this.height * this.frames.length);
                this.gif = new GifWriter(this.buffer, this.width, this.height, { loop: 0 });

                this.frames.forEach(frame => {
                    this.gif.addFrame(0, 0, this.width, this.height, frame.pixels, {
                        palette: new Uint32Array(frame.palette),
                        delay: frame.delay / 10,
                        disposal: 1
                    });
                });

                this.stats = this.frames.reduce((acc, frame) => {
                    acc.frames.push(frame.duration);
                    acc.total += frame.duration;
                    return acc;
                }, { total: 0, frames: [] });

                buffer = new Uint8Array(this.gif.end());

                for (let i = 0, l = this.gif.end(); i < l; i++) {
                    string += String.fromCharCode(this.buffer[i]);
                    buffer[i] = this.buffer[i];
                }

                this.data_url = 'data:image/gif;base64,' + window.btoa(string);

                this.generating = false;
                return resolve(new Blob([buffer], { type: "image/gif" }));
            };
            this.tick();
        });
    }
}

export { GifEncoder };
