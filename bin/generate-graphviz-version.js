#! /usr/bin/env node

import hpccWasm from "@hpcc-js/wasm";

const graphvizVersion = await hpccWasm.graphvizVersion();

console.log(`const graphvizVersion = "${graphvizVersion}";`);
console.log('export {graphvizVersion};');
