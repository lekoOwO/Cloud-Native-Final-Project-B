import {log as _log, error as _error} from "../log.mjs";

function log(...x){
    _log(`[Adjuster]`, ...x);
}

function error(...x){
    _error(`[Adjuster]`, ...x);
}

export {log, error}