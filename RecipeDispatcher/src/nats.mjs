import {config, log as __log} from "./utils.mjs"
import { connect, StringCodec } from "nats";

const nc = await connect(config.server);
const sc = StringCodec();

function log(...args) {
    return __log("[NATS]", ...args);
}

async function subscribe(subject, cb){
    const s = nc.subscribe(subject);

    (async (sub) => {
        log(`listening for ${sub.getSubject()} requests...`);
        for await (const m of sub) {
            const data = `${m.data ? " " + sc.decode(m.data) : ""}`;
            const response = await cb(data);

            if (response) {
                log(`sending response: ${response}`);
                m.respond(response);
            }
        }
        log(`subscription ${sub.getSubject()} drained.`);
    })(s);
};

function publish(subject, data){
    nc.publish(subject, sc.encode(JSON.stringify(data, null, 2)));
}

export {
    nc, sc, subscribe, publish
}