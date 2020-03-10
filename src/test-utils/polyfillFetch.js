import {promises} from "fs";

export default function polyfillFetch() {
    global.fetch = function(filename) {
        return promises.open(filename, 'r').then((filehandle) => {
            return filehandle.readFile().then(data => {
                return {
                    ok: true,
                    arrayBuffer: () => data,
                };
            });
        });
    }

    Object.defineProperty(window.document, "currentScript", {
        get() { return {src: './node_modules/@hpcc-js/wasm/dist/index.js'}; }
    });

    global.document = {
        "currentScript": {
            src: './node_modules/@hpcc-js/wasm/dist/index.js'
        }
    };
}
