import { AudioPlayer } from '../../../scripts/kano/music/player.js';

export default {
    test: /\.wav|\.m4a|\.mp3$/,
    parser: (r) => {
        return r.arrayBuffer()
            .then(data => new Promise((resolve, reject) => {
                if ('webkitAudioContext' in window) {
                    const source = AudioPlayer.context.createBufferSource();
                    source.buffer = AudioPlayer.context.createBuffer(data, false);
                    resolve(source.buffer);
                } else {
                    AudioPlayer.context.decodeAudioData(data, buffer => resolve(buffer));
                }
            }));
    },
};
