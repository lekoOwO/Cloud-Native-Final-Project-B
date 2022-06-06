import {log as _log, error as _error} from "../log.mjs";

function log(...x){
    _log(`[Factory]`, ...x);
}

function error(...x){
    _error(`[Factory]`, ...x);
}

export {log, error}