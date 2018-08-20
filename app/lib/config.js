const DEFAULT = {
    WORKSPACE_FULL_SIZE: {
        width: 512,
        height: 384,
    },
    VOICE_API_URL: '//api.voicerss.org',
    VOICE_API_KEY: '65b85d9c94094d62bddfd37acd5786b4',
    WEATHER_API_KEY: '79f483fba81614f1e7d1fea5a28b9750',
    GAMIFICATION_ASSETS_URL_PREFIX: 'https://s3-eu-west-1.amazonaws.com/world.kano.me/static/gamification',
    USE_HARDWARE_API: false,
    HARDWARE_API_URL: 'http://localhost:13370',
    APP_ID: 'kano_code',
    TRACKING: {
        SCHEMA: 'kano_code',
    },
    GEO_API: 'http://kano-geoip-api.herokuapp.com/country/',
    ENABLE_CHALLENGE_GENERATOR: false,
};

const Config = {
    merge(opts) {
        return Object.assign({}, DEFAULT, opts);
    },
};

export default Config;

export { DEFAULT };
