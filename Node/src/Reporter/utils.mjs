import {log as _log, error as _error} from "../log.mjs";

function log(...x){
    _log(`[Reporter]`, ...x);
}

function error(...x){
    _error(`[Reporter]`, ...x);
}

export {log, error}