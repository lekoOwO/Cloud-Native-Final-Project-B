import {config} from "../utils.mjs"
import {Oven} from "./oven.mjs"

const oven = new Oven(config.node.id);

export {oven};