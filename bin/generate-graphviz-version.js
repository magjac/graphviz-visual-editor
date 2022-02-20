#! /usr/bin/env node

var hpccWasm = require("@hpcc-js/wasm/dist");
var fs_promises = require("fs").promises;

global.fetch = function (filename) {
  return fs_promises.open(filename, 'r').then((filehandle) => {
    return filehandle.readFile().then(data => {
      return {
        ok: true,
        arrayBuffer: () => data,
      };
    });
  });
}

global.document = {
  "currentScript": {
    src: './node_modules/@hpcc-js/wasm/dist/index.js'
  }
};

hpccWasm.graphvizVersion().then(graphvizVersion => {
  console.log(`const graphvizVersion = "${graphvizVersion}";`);
  console.log('export {graphvizVersion};');
});
