/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("node:path");
require("ts-node").register();
require(path.join(__dirname, "camera-worker.ts"));
