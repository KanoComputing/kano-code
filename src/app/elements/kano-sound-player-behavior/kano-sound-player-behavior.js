window.AudioContext = window.AudioContext || window.webkitAudioContext;
var cache = {},
    ctx,
    //25 ms safetyBuffer for scheduling
    safetyBuffer = 0.25;
if (window.AudioContext) {
    ctx = new AudioContext();
}

/**
 * @polymerBehavior
 */
export const SoundPlayerBehavior = {
    playSound (url, analyserOn, offset=0) {
        if (!ctx) {
            return;
        }
        this.loadSound(url)
            .then(buffer => {
                var source = ctx.createBufferSource();
                source.buffer = buffer;
                if (analyserOn) {
                    this.analyseSound(source);
                }
                source.connect(ctx.destination);
                //playback starts at first non-null value in buffer (idea from https://jakearchibald.com/2016/sounds-fun/)
                source.start(ctx.currentTime + safetyBuffer + offset, cache[url].startTime);
            });
    },
    loadSound (url) {
        if (cache[url]) {
            return Promise.resolve(cache[url].buffer);
        } else {
            return fetch(url)
                .then(res => res.arrayBuffer())
                .then(data => {
                    return new Promise((resolve, reject) => {
                        ctx.decodeAudioData(data, (buffer) => {
                            cache[url] = {
                                buffer: buffer,
                                startTime: this.findStartGapDuration(buffer)
                            }
                            return resolve(buffer);
                        });
                    });
                });
        }
    },
    analyseSound (source) {
        var analyser = ctx.createAnalyser();
        analyser.smoothingTimeConstant = 0.3;
        analyser.fftSize = 1024;
        source.connect(analyser);
        //a script processor to listen for audio process in the audio context
        var processorNode = ctx.createScriptProcessor(2048, 1, 1);
        processorNode.connect(ctx.destination);
        processorNode.onaudioprocess = function () {
            this.debounce('getTheVolume', () => {
              var values = new Uint8Array(analyser.frequencyBinCount);
              analyser.getByteFrequencyData(values);
              this.fire('frequency-data', {data: values});
            }, 30);
        }.bind(this);
        source.onended = () => {
            this.fire('sound-ended');
            processorNode.onaudioprocess = null;
        }
    },
    findStartGapDuration(buffer) {
        var c1 = buffer.getChannelData(0);
        //if stereo, get the other channel too
        var c2 = buffer.numberOfChannels > 1 ? buffer.getChannelData(1) : null;
        for (var i = 0, len = c1.length; i < len; i++) {
          if (c1[i] || (c2 && c2[i])) {
            // gap value in seconds
            return i / buffer.sampleRate;
          }
        }
        //if there's no sound
        return buffer.duration;
    }
};