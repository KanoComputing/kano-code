import { config as config$0 } from './default.js';
const prod = config$0;
prod.API_URL = "https://api.kano.me";
prod.DATA_API_URL = "https://apps-data.kano.me";
prod.WORLD_URL = "https://world.kano.me";
prod.SHARED_STORAGE_URL = "https://world.kano.me/cross-storage.html";
prod.PROJECTS_URL = prod.WORLD_URL + "/projects";
prod.KANO_CODE_URL = "https://apps.kano.me";
prod.GOOGLE_API_KEY = "AIzaSyB3CO_eTW7T_bwAQFewuUqwNElg_b9B6lQ";
prod.VOICE_API_KEY = "99f3958bbbed4c9abe8d22ad6fabd55f";
prod.TAPCODE_URL = "https://tapcode.kano.me";
export { prod as config };
