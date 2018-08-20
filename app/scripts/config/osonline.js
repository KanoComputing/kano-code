import { config as config$0 } from './default.js';
const os = config$0;
os.TOKEN_ENDPOINT = "http://localhost:8000/gettoken";
os.SHUTDOWN_ENDPOINT = "http://localhost:8000/shutdown";

export { os as config };
