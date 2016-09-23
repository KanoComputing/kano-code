var es6Assign = require('es6-object-assign');

es6Assign.polyfill();

var COMMON = {
        "WORKSPACE_FULL_SIZE": {
            "width": 512,
            "height": 384
        },
        "WORKSPACE_LED_BOARD_SIZE": {
            "width": 466,
            "height": 322
        },
        "VOICE_API_URL": "//api.voicerss.org",
        "VOICE_API_KEY": "65b85d9c94094d62bddfd37acd5786b4",
        "WEATHER_API_KEY": "79f483fba81614f1e7d1fea5a28b9750",
        "HARDWARE_API_URL": "//localhost:3000",
        "DEFAULT_META_DATA": [
            ["og:title", "Kano Code"],
            ["og:description", "Make real apps, real fast"],
            ["og:site-name", "Kano Code"],
            ["og:url", "https://apps.kano.me/"],
            ["og:image", ""],
            ["twitter:card", "summary_large_image"],
            ["twitter:site", "@teamkano"],
            ["theme-color", "#ff842a"]
        ]
    },
    ENV = {
        "production": {
            "API_URL": "https://api.kano.me",
            "DATA_API_URL": "https://apps-data.kano.me",
            "WORLD_URL": "https://world.kano.me",
            "GOOGLE_API_KEY": "AIzaSyDPqXOx9Xsyjw2xP9VLcjtJQl8sbUWznqk"
        },
        "staging": {
            "API_URL": "https://api-staging.kano.me",
            "DATA_API_URL": "https://apps-data-staging.kano.me",
            "WORLD_URL": "https://world-staging.kano.me",
            "GOOGLE_API_KEY": "AIzaSyDPqXOx9Xsyjw2xP9VLcjtJQl8sbUWznqk"
        },
        "development": {
            "API_URL": "http://localhost:1234",
            "DATA_API_URL": "http://localhost:2020",
            "WORLD_URL": "http://localhost:5000",
            "GOOGLE_API_KEY": "AIzaSyCk3HlbKJV4-ZJcRqwViaZ8mCIKU2LsnE0"
        }
    },
    TARGET = {
        "web": {
        },
        "rpi": {
            "API_URL": "http://localhost:8000",
            "PERF_SAFE": true
        },
        "osonline": {
            "TOKEN_ENDPOINT": "http://localhost:8000/gettoken",
            "SHUTDOWN_ENDPOINT": "http://localhost:8000/shutdown"
        }
    },
    config;

function getConfig(env, target) {
    var flags;
    env = env || 'development';
    target = target || 'web';

    if (typeof localStorage !== 'undefined' && env !== 'production') {
        // Fail safely read the flags from the localstorage
        try {
            flags = JSON.parse(localStorage.getItem('flags'));
        } catch (e) {}
    }

    return Object.assign(COMMON, TARGET[target],
           ENV[env], {"ENV": env, "TARGET": target}, { "FLAGS": flags });
}

function updateFlags(flags) {
    config.FLAGS = flags;
    localStorage.setItem('flags', JSON.stringify(flags));
}

function addExperiments(type, experiments) {
    var experiment,
        flags = config.getFlags();
    experiments.forEach(key => {
        flags.available[key] = flags.available[key] || [];
        experiment = flags.available[key];
        if (experiment.indexOf(type) === -1) {
            experiment.push(type);
        }
    });
}

function getFlags() {
    config.FLAGS = config.FLAGS || {};
    config.FLAGS.experiments = config.FLAGS.experiments || [];
    config.FLAGS.available = config.FLAGS.available || {};
    return config.FLAGS;
}

if (typeof window === 'undefined') {
    window = {};
}

/* These window.* variables are exported in both make and play apps. */
config = getConfig(window.ENV, window.TARGET);
config.getConfig = getConfig;
config.updateFlags = updateFlags;
config.addExperiments = addExperiments;
config.getFlags = getFlags;

module.exports = config;
