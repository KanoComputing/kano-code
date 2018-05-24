const config = {};

config.WORKSPACE_FULL_SIZE = {
    "width": 512,
    "height": 384
};
config.VOICE_API_URL = "//api.voicerss.org";
config.VOICE_API_KEY = "65b85d9c94094d62bddfd37acd5786b4";
config.WEATHER_API_KEY = "79f483fba81614f1e7d1fea5a28b9750";
config.GAMIFICATION_ASSETS_URL_PREFIX = "https://s3-eu-west-1.amazonaws.com/world.kano.me/static/gamification";
config.USE_HARDWARE_API = false;
config.HARDWARE_API_URL = "http://localhost:13370";
config.APP_ID = "kano_code";
config.TRACKING = {
    SCHEMA: "kano_code"
};
config.GEO_API = "http://kano-geoip-api.herokuapp.com/country/";

config.BLOCKLY_MEDIA = '/@kano/kwc-blockly/blockly_built/media/'

export { config };
