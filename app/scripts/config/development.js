import { config as config$0 } from './default.js';
const dev = config$0;
dev.API_URL = "http://localhost:1234";
dev.DATA_API_URL = "http://localhost:2020";
dev.DEBUG = true;
dev.WORLD_URL = "http://localhost:5000";
dev.SHARED_STORAGE_URL = "https://world-staging.kano.me/cross-storage.html";
dev.PROJECTS_URL = dev.WORLD_URL + "/projects";
dev.KANO_CODE_URL = "http://localhost:4000";
dev.GOOGLE_API_KEY = "AIzaSyB3CO_eTW7T_bwAQFewuUqwNElg_b9B6lQ";
dev.TAPCODE_URL = "https://tapcode-staging.kano.me";

export { dev as config };
