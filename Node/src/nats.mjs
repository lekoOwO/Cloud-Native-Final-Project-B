import { config, sleep } from "./utils.mjs"
import { connect, StringCodec } from "nats";

const nc = await connect(config.server);
const sc = StringCodec();

async function subscribe(subject, cb){
    const s = nc.subscribe(subject);

    (async (sub) => {
        console.log(`listening for ${sub.getSubject()} requests...`);
        for await (const m of sub) {
            const data = `${m.data ? sc.decode(m.data) : ""}`;
            const response = await cb(data);

            if (response) {
                console.log(`sending response: ${response}`);
                m.respond(response);
            }
        }
        console.log(`subscription ${sub.getSubject()} drained.`);
    })(s);
};

(async() => {
    while(true){
        await nc.flush();
        await sleep(2000);
    }
})();

function publish(subject, data){
    nc.publish(subject, sc.encode(JSON.stringify(data, null, 2)));
}

export {
    nc, sc, subscribe, publish
}