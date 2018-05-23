import { generators as generators$0 } from './stickers.js';
import { config } from '../../../config/default.js';
export const types = types || {};

types.samples = 'audio';

export const samplesDir = {
    name: 'Samples',
    children: [
    {
            name: 'Obelisk',
            children: [{
                name: 'Samples',
                children: [{
                    name: 'Arpeggio',
                    children: [{
                        name: 'Big Hill Arpeggio',
                        filename: 'obelisk/samples/arpeggio/bigHillArpeggio'
                    },
                    {
                        name: 'Glass Castle Arpeggio',
                        filename: 'obelisk/samples/arpeggio/glassCastleArpeggio'
                    },
                    {
                        name: 'Traffic Lights Arpeggio',
                        filename: 'obelisk/samples/arpeggio/trafficLightsArpeggio'
                    },
                    {
                        name: 'Traffic Lights Slow Arpeggio',
                        filename: 'obelisk/samples/arpeggio/trafficLightsSlowArpeggio'
                    }]
                },{
                    name: 'Melody',
                    children: [{
                        name: 'Friendly Monster Melody',
                        filename: 'obelisk/samples/melody/friendlyMonsterMelody'
                    },
                    {
                        name: 'Moon Trip Melody',
                        filename: 'obelisk/samples/melody/moonTripMelody'
                    },
                    {
                        name: 'Sleepy Badger Melody',
                        filename: 'obelisk/samples/melody/sleepyBadgerMelody'
                    }]
                },{
                    name: 'One Shot FX',
                    children: [{
                        name: 'Caterpillar Hit',
                        filename: 'obelisk/samples/one_shot_fx/caterpillarHit'
                    },
                    {
                        name: 'Kano Hit',
                        filename: 'obelisk/samples/one_shot_fx/KanoHit'
                    },
                    {
                        name: 'Kite Hit',
                        filename: 'obelisk/samples/one_shot_fx/kiteHit'
                    },
                    {
                        name: 'Little Toe Hit',
                        filename: 'obelisk/samples/one_shot_fx/littleToeHit'
                    },
                    {
                        name: 'Power Hit',
                        filename: 'obelisk/samples/one_shot_fx/powerHit'
                    },
                    {
                        name: 'Reverse Hit',
                        filename: 'obelisk/samples/one_shot_fx/reverseHit'
                    },
                    {
                        name: 'Squish Hit',
                        filename: 'obelisk/samples/one_shot_fx/squishHit'
                    },
                    {
                        name: 'Yop Hit',
                        filename: 'obelisk/samples/one_shot_fx/yopHit'
                    }]
                },{
                    name: 'Rhythmic',
                    children: [{
                        name: 'Bounce Machine Beat',
                        filename: 'obelisk/samples/rhythmic/bounceMachineBeat'
                    },
                    {
                        name: 'Glitcheeee Beat',
                        filename: 'obelisk/samples/rhythmic/glitcheeeeBeat'
                    },
                    {
                        name: 'Nod Plod Beat',
                        filename: 'obelisk/samples/rhythmic/nodPlodBeat'
                    },
                    {
                        name: 'Tricycle Beat',
                        filename: 'obelisk/samples/rhythmic/tricycleBeat'
                    }]
                },{
                    name: 'HiHat Variations',
                    children: [{
                        name: 'HiHats 4T Beat',
                        filename: 'obelisk/samples/hihat_variations/hihats_4T_Beat'
                    },
                    {
                        name: 'HiHats 16 Beat',
                        filename: 'obelisk/samples/hihat_variations/hihats_16_Beat'
                    },
                    {
                        name: 'HiHats 16T Beat',
                        filename: 'obelisk/samples/hihat_variations/hihats_16T_Beat'
                    },
                    {
                        name: 'HiHats 32 Beat',
                        filename: 'obelisk/samples/hihat_variations/hihats_32_Beat'
                    }]
                }]
            },{
                name: 'Synths',
                children: [{
                    name: 'Cat',
                    children: [{
                        name: 'Cat Synth 1',
                        filename: 'obelisk/synths/cat_synth/catSynth1'
                    },
                    {
                        name: 'Cat Synth 2',
                        filename: 'obelisk/synths/cat_synth/catSynth2'
                    },
                    {
                        name: 'Cat Synth 3',
                        filename: 'obelisk/synths/cat_synth/catSynth3'
                    },
                    {
                        name: 'Cat Synth 5',
                        filename: 'obelisk/synths/cat_synth/catSynth5'
                    },
                    {
                        name: 'Cat Synth 6',
                        filename: 'obelisk/synths/cat_synth/catSynth6'
                    },
                    {
                        name: 'Cat Synth 7',
                        filename: 'obelisk/synths/cat_synth/catSynth7'
                    },
                    {
                        name: 'Cat Synth 8',
                        filename: 'obelisk/synths/cat_synth/catSynth8'
                    }]
                },{
                    name: 'Cloud',
                    children: [{
                        name: 'Cloud Synth 1',
                        filename: 'obelisk/synths/cloud_synth/cloudSynth1'
                    },
                    {
                        name: 'Cloud Synth 2',
                        filename: 'obelisk/synths/cloud_synth/cloudSynth2'
                    },
                    {
                        name: 'Cloud Synth 3',
                        filename: 'obelisk/synths/cloud_synth/cloudSynth3'
                    },
                    {
                        name: 'Cloud Synth 4',
                        filename: 'obelisk/synths/cloud_synth/cloudSynth4'
                    },
                    {
                        name: 'Cloud Synth 5',
                        filename: 'obelisk/synths/cloud_synth/cloudSynth5'
                    },
                    {
                        name: 'Cloud Synth 6',
                        filename: 'obelisk/synths/cloud_synth/cloudSynth6'
                    },
                    {
                        name: 'Cloud Synth 7',
                        filename: 'obelisk/synths/cloud_synth/cloudSynth7'
                    },
                    {
                        name: 'Cloud Synth 8',
                        filename: 'obelisk/synths/cloud_synth/cloudSynth8'
                    }]
                },{
                    name: 'Hedgehog',
                    children: [{
                        name: 'hedgehogSynth1',
                        filename: 'obelisk/synths/hedgehog_synth/hedgehogSynth1'
                    },
                    {
                        name: 'Hedgehog Synth 2',
                        filename: 'obelisk/synths/hedgehog_synth/hedgehogSynth2'
                    },
                    {
                        name: 'Hedgehog Synth 4',
                        filename: 'obelisk/synths/hedgehog_synth/hedgehogSynth4'
                    },
                    {
                        name: 'Hedgehog Synth 5',
                        filename: 'obelisk/synths/hedgehog_synth/hedgehogSynth5'
                    },
                    {
                        name: 'Hedgehog Synth 6',
                        filename: 'obelisk/synths/hedgehog_synth/hedgehogSynth6'
                    },
                    {
                        name: 'Hedgehog Synth 7',
                        filename: 'obelisk/synths/hedgehog_synth/hedgehogSynth7'
                    },
                    {
                        name: 'Hedgehog Synth 8',
                        filename: 'obelisk/synths/hedgehog_synth/hedgehogSynth8'
                    }]
                },{
                    name: 'Pigeon',
                    children: [{
                        name: 'Pigeon Synth 1',
                        filename: 'obelisk/synths/pigeon_synth/pigeonSynth1'
                    },
                    {
                        name: 'Pigeon Synth 2',
                        filename: 'obelisk/synths/pigeon_synth/pigeonSynth2'
                    },
                    {
                        name: 'Pigeon Synth 3',
                        filename: 'obelisk/synths/pigeon_synth/pigeonSynth3'
                    },
                    {
                        name: 'Pigeon Synth 4',
                        filename: 'obelisk/synths/pigeon_synth/pigeonSynth4'
                    },
                    {
                        name: 'Pigeon Synth 5',
                        filename: 'obelisk/synths/pigeon_synth/pigeonSynth5'
                    },
                    {
                        name: 'Pigeon Synth 6',
                        filename: 'obelisk/synths/pigeon_synth/pigeonSynth6'
                    },
                    {
                        name: 'Pigeon Synth 7',
                        filename: 'obelisk/synths/pigeon_synth/pigeonSynth7'
                    },
                    {
                        name: 'Pigeon Synth 8',
                        filename: 'obelisk/synths/pigeon_synth/pigeonSynth8'
                    }]
                }]
            }]
        },
        {
            "name": "Drum Machine",
            "children": [
                {
                    "filename": "claves",
                    "name": "Claves"
                },
                {
                    "filename": "bass_drum",
                    "name": "Bass drum"
                },
                {
                    "filename": "closed_hi_hat",
                    "name": "Closed hi hat"
                },
                {
                    "filename": "cowbell",
                    "name": "Cowbell"
                },
                {
                    "filename": "cymbal",
                    "name": "Cymbal"
                },
                {
                    "filename": "hand_clap",
                    "name": "Hand clap"
                },
                {
                    "filename": "hi_conga",
                    "name": "Hi conga"
                },
                {
                    "filename": "hi_tom",
                    "name": "Hi tom"
                },
                {
                    "filename": "low_conga",
                    "name": "Low conga"
                },
                {
                    "filename": "low_tom",
                    "name": "Low tom"
                },
                {
                    "filename": "maracas",
                    "name": "Maracas"
                },
                {
                    "filename": "mid_conga",
                    "name": "Mid conga"
                },
                {
                    "filename": "mid_tom",
                    "name": "Mid tom"
                },
                {
                    "filename": "open_hi_hat",
                    "name": "Open hi hat"
                },
                {
                    "filename": "rim_shot",
                    "name": "Rim shot"
                },
                {
                    "filename": "snare_drum",
                    "name": "Snare drum"
                }
            ]
        },
        {
            "name": "Acoustic Guitar",
            "children": [
                {
                    "filename": "guitar_1st_E",
                    "name": "Note 1"
                },
                {
                    "filename": "guitar_2nd_B",
                    "name": "Note 2"
                },
                {
                    "filename": "guitar_3rd_G",
                    "name": "Note 3"
                },
                {
                    "filename": "guitar_4th_D",
                    "name": "Note 4"
                },
                {
                    "filename": "guitar_5th_A",
                    "name": "Note 5"
                }
            ]
        },
        {
            "name": "Electric Guitar",
            "children": [
                {
                    "filename": "electric_guitar_1",
                    "name": "Note 1"
                },
                {
                    "filename": "electric_guitar_2",
                    "name": "Note 2"
                },
                {
                    "filename": "electric_guitar_3",
                    "name": "Note 3"
                },
                {
                    "filename": "electric_guitar_4",
                    "name": "Note 4"
                },
                {
                    "filename": "electric_guitar_5",
                    "name": "Note 5"
                }
            ]
        },
        {
            "name": "Instruments",
            "children": [
                {
                    "filename": "ambi_piano",
                    "name": "Ambi Piano"
                },
                {
                    "filename": "bass_hit_c",
                    "name": "Bass Hit"
                },
                {
                    "filename": "bass_voxy_hit_c",
                    "name": "Bass Voxy Hit"
                },
                {
                    "filename": "drum_bass_hard",
                    "name": "Drum Bass Hard"
                },
                {
                    "filename": "bd_ada",
                    "name": "Drum Beat"
                },
                {
                    "filename": "drum_cymbal_hard",
                    "name": "Drum Cymbal Hard"
                },
                {
                    "filename": "drum_roll",
                    "name": "Drum Roll"
                },
                {
                    "filename": "joke_drum",
                    "name": "Joke Drum"
                }
            ]
        },
        {
            "name": "Kano",
            "children": [
                {
                    "filename": "boot_up_v2",
                    "name": "Boot Up"
                },
                {
                    "filename": "boot_up",
                    "name": "Boot Up 2"
                },
                {
                    "filename": "challenge_complete",
                    "name": "Challenge Complete"
                },
                {
                    "filename": "error2",
                    "name": "Error"
                },
                {
                    "filename": "error_v2",
                    "name": "Error 2"
                },
                {
                    "filename": "error",
                    "name": "Error 3"
                },
                {
                    "filename": "grab",
                    "name": "Grab"
                },
                {
                    "filename": "make",
                    "name": "Make"
                },
                {
                    "filename": "ungrab",
                    "name": "Ungrab"
                }
            ]
        },
        {
            "name": "Loops",
            "children": [
                {
                    "filename": "loop_amen_full",
                    "name": "Amen"
                },
                {
                    "filename": "apache",
                    "name": "Apache"
                },
                {
                    "filename": "bass_loop",
                    "name": "Bass"
                },
                {
                    "filename": "loop_compus",
                    "name": "Compus"
                },
                {
                    "filename": "loop_mika",
                    "name": "Mika"
                },
                {
                    "filename": "loop_mountain",
                    "name": "Mountain"
                },
                {
                    "filename": "loop_safari",
                    "name": "Safari"
                }
            ]
        },
        {
            "name": "Sounds",
            "children": [
                {
                    "filename": "perc_bell",
                    "name": "Bell"
                },
                {
                    "filename": "misc_burp",
                    "name": "Burp"
                },
                {
                    "filename": "misc_crow",
                    "name": "Crow"
                },
                {
                    "filename": "air_horn",
                    "name": "Air Horn"
                },
                {
                    "filename": "short_fart",
                    "name": "Fart"
                },
                {
                    "filename": "frequency_sweep",
                    "name": "Frequency Sweep"
                },
                {
                    "filename": "elec_ping",
                    "name": "Ping"
                },
                {
                    "filename": "perc_snap",
                    "name": "Snap"
                },
                {
                    "filename": "perc_swash",
                    "name": "Swash"
                },
                {
                    "filename": "elec_twip",
                    "name": "Twip"
                },
                {
                    "filename": "vinyl_backspin",
                    "name": "Vinyl"
                }
            ]
        }
    ]
};

const LEGACY_CATEGORIES = ["Drum Machine", "Acoustic Guitar", "Electric Guitar", "Instruments", "Kano", "Loops", "Sounds"];

// Convert the file structure to the old structure to support legacy blocks relying on it
export const samples = samplesDir.children.reduce((acc, item) => {
    if (LEGACY_CATEGORIES.indexOf(item.name) !== -1) {
        acc[item.name] = item.children.reduce((acc, item) => {
            acc[item.filename] = item.name;
            return acc;
        }, {});
    }
    return acc;
}, {});

export const generators = generators$0 || {};

generators$0.samples = function (sample) {
    return `${config.KANO_CODE_URL}/assets/audio/samples/${sample}.wav`;
};
