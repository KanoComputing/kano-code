
export interface ISample {
    id : string;
    label : string;
    src : string;
}

export interface ISampleSet {
    id : string;
    label : string;
    resources : ISample[];
}

export const samples : ISampleSet[] = [{
    label: 'Drum Machine',
    id: 'drum-machine',
    resources: [{
        id: 'claves',
        label: 'Claves',
        src: 'claves.wav',
    }, {
        id: 'bass-drum',
        label: 'Bass drum',
        src: 'bass_drum.wav',
    }, {
        src: 'closed_hi_hat.wav',
        label: 'Closed hi hat',
        id: 'closed_hi_hat',
    }, {
        src: 'cowbell.wav',
        label: 'Cowbell',
        id: 'cowbell',
    }, {
        src: 'cymbal.wav',
        label: 'Cymbal',
        id: 'cymbal',
    }, {
        src: 'hand_clap.wav',
        label: 'Hand clap',
        id: 'hand_clap',
    }, {
        src: 'hi_conga.wav',
        label: 'Hi conga',
        id: 'hi_conga',
    }, {
        src: 'hi_tom.wav',
        label: 'Hi tom',
        id: 'hi_tom',
    }, {
        src: 'low_conga.wav',
        label: 'Low conga',
        id: 'low_conga',
    }, {
        src: 'low_tom.wav',
        label: 'Low tom',
        id: 'low_tom',
    }, {
        src: 'maracas.wav',
        label: 'Maracas',
        id: 'maracas',
    }, {
        src: 'mid_conga.wav',
        label: 'Mid conga',
        id: 'mid_conga',
    }, {
        src: 'mid_tom.wav',
        label: 'Mid tom',
        id: 'mid_tom',
    }, {
        src: 'open_hi_hat.wav',
        label: 'Open hi hat',
        id: 'open_hi_hat',
    }, {
        src: 'rim_shot.wav',
        label: 'Rim shot',
        id: 'rim_shot',
    }, {
        src: 'snare_drum.wav',
        label: 'Snare drum',
        id: 'snare_drum',
    }],
}, {
    label: 'Acoustic Guitar',
    id: 'acoustic-guitar',
    resources: [{
        src: 'guitar_1st_E.wav',
        id: 'guitar_1st_E',
        label: 'Note 1',
    }, {
        src: 'guitar_2nd_B.wav',
        id: 'guitar_2nd_B',
        label: 'Note 2',
    }, {
        src: 'guitar_3rd_G.wav',
        id: 'guitar_3rd_G',
        label: 'Note 3',
    }, {
        src: 'guitar_4th_D.wav',
        id: 'guitar_4th_D',
        label: 'Note 4',
    }, {
        src: 'guitar_5th_A.wav',
        id: 'guitar_5th_A',
        label: 'Note 5',
    }],
}, {
    label: 'Electric Guitar',
    id: 'electric-guitar',
    resources: [{
        src: 'electric_guitar_1.wav',
        id: 'electric_guitar_1',
        label: 'Note 1',
    }, {
        src: 'electric_guitar_2.wav',
        id: 'electric_guitar_2',
        label: 'Note 2',
    }, {
        src: 'electric_guitar_3.wav',
        id: 'electric_guitar_3',
        label: 'Note 3',
    }, {
        src: 'electric_guitar_4.wav',
        id: 'electric_guitar_4',
        label: 'Note 4',
    }, {
        src: 'electric_guitar_5.wav',
        id: 'electric_guitar_5',
        label: 'Note 5',
    }]
}, {
    label: 'Instruments',
    id: 'instruments',
    resources: [{
        src: 'ambi_piano.wav',
        id: 'ambi_piano',
        label: 'Ambi Piano',
    }, {
        src: 'bass_hit_c.wav',
        id: 'bass_hit_c',
        label: 'Bass Hit',
    }, {
        src: 'bass_voxy_hit_c.wav',
        id: 'bass_voxy_hit_c',
        label: 'Bass Voxy Hit',
    }, {
        src: 'drum_bass_hard.wav',
        id: 'drum_bass_hard',
        label: 'Drum Bass Hard',
    }, {
        src: 'bd_ada.wav',
        id: 'bd_ada',
        label: 'Drum Beat',
    }, {
        src: 'drum_cymbal_hard.wav',
        id: 'drum_cymbal_hard',
        label: 'Drum Cymbal Hard',
    }, {
        src: 'drum_roll.wav',
        id: 'drum_roll',
        label: 'Drum Roll',
    }, {
        src: 'joke_drum.wav',
        id: 'joke_drum',
        label: 'Joke Drum',
    }]
}, {
    label: 'Kano',
    id: 'kano',
    resources: [{
        src: 'boot_up_v2.wav',
        id: 'boot_up_v2',
        label: 'Boot Up',
    }, {
        src: 'boot_up.wav',
        id: 'boot_up',
        label: 'Boot Up 2',
    }, {
        src: 'challenge_complete.wav',
        id: 'challenge_complete',
        label: 'Challenge Complete',
    }, {
        src: 'error2.wav',
        id: 'error2',
        label: 'Error',
    }, {
        src: 'error_v2.wav',
        id: 'error_v2',
        label: 'Error 2',
    }, {
        src: 'error.wav',
        id: 'error',
        label: 'Error 3',
    }, {
        src: 'grab.wav',
        id: 'grab',
        label: 'Grab',
    }, {
        src: 'make.wav',
        id: 'make',
        label: 'Make',
    }, {
        src: 'ungrab.wav',
        id: 'ungrab',
        label: 'Ungrab',
    }]
}, {
    label: 'Loops',
    id: 'loops',
    resources: [{
        src: 'loop_amen_full.wav',
        id: 'loop_amen_full',
        label: 'Amen',
    }, {
        src: 'apache.wav',
        id: 'apache',
        label: 'Apache',
    }, {
        src: 'bass_loop.wav',
        id: 'bass_loop',
        label: 'Bass',
    }, {
        src: 'loop_compus.wav',
        id: 'loop_compus',
        label: 'Compus',
    }, {
        src: 'loop_mika.wav',
        id: 'loop_mika',
        label: 'Mika',
    }, {
        src: 'loop_mountain.wav',
        id: 'loop_mountain',
        label: 'Mountain',
    }, {
        src: 'loop_safari.wav',
        id: 'loop_safari',
        label: 'Safari',
    }],
}, {
    label: 'Sounds',
    id: 'sounds',
    resources: [{
        src: 'perc_bell.wav',
        id: 'perc_bell',
        label: 'Bell',
    }, {
        src: 'misc_burp.wav',
        id: 'misc_burp',
        label: 'Burp',
    }, {
        src: 'misc_crow.wav',
        id: 'misc_crow',
        label: 'Crow',
    }, {
        src: 'air_horn.wav',
        id: 'air_horn',
        label: 'Air Horn',
    }, {
        src: 'short_fart.wav',
        id: 'short_fart',
        label: 'Fart',
    }, {
        src: 'frequency_sweep.wav',
        id: 'frequency_sweep',
        label: 'Frequency Sweep',
    }, {
        src: 'elec_ping.wav',
        id: 'elec_ping',
        label: 'Ping',
    }, {
        src: 'perc_snap.wav',
        id: 'perc_snap',
        label: 'Snap',
    }, {
        src: 'perc_swash.wav',
        id: 'perc_swash',
        label: 'Swash',
    }, {
        src: 'elec_twip.wav',
        id: 'elec_twip',
        label: 'Twip',
    }, {
        src: 'vinyl_backspin.wav',
        id: 'vinyl_backspin',
        label: 'Vinyl',
    }]
}];
