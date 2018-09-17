import { AudioPlayer } from '../../../scripts/kano/music/player.js';

export default {
    test: /\.wav|\.m4a|\.mp3$/,
    parser: (r) => {
        return r.arrayBuffer()
            .then(data => AudioPlayer.context.decodeAudioData(data));
    },
};
