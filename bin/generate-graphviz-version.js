#! /usr/bin/env node

import { Graphviz } from "@hpcc-js/wasm/graphviz";

const graphviz = await Graphviz.load();
const graphvizVersion = graphviz.version();

console.log(`const graphvizVersion = "${graphvizVersion}";`);
console.log('export {graphvizVersion};');
