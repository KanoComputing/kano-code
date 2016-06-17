var es6Assign = require('es6-object-assign');

es6Assign.polyfill();

var COMMON = {
        "WORKSPACE_FULL_SIZE": {
            "width": 512,
            "height": 384
        },
        "WORKSPACE_LED_BOARD_SIZE": {
            "width": 466,
            "height": 240
        },
        "VOICE_API_URL": "http://api.voicerss.org",
        "VOICE_API_KEY": "65b85d9c94094d62bddfd37acd5786b4",
        "WEATHER_API_KEY": "79f483fba81614f1e7d1fea5a28b9750",
        "HARDWARE_API_URL": "http://localhost:3000",
        "DEFAULT_META_DATA": [
            ["og:title", "Make Apps"],
            ["og:description", "Make real apps, real fast"],
            ["og:site-name", "Make Apps"],
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
            "WORLD_URL": "http://world-staging.kano.me",
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
            "API_URL": "http://localhost:8000"
        },
        "osonline": {
            "TOKEN_ENDPOINT": "http://localhost:8000/gettoken",
            "SHUTDOWN_ENDPOINT": "http://localhost:8000/shutdown"
        }
    },
    config;

function getConfig(env, target) {
    env = env || 'development';
    target = target || 'web';

    return Object.assign(COMMON, TARGET[target],
           ENV[env], {"ENV": env, "TARGET": target});
}

if (typeof window === 'undefined') {
    window = {};
}

/* These window.* variables are exported in both make and play apps. */
config = getConfig(window.ENV, window.TARGET);
config.getConfig = getConfig;

module.exports = config;
