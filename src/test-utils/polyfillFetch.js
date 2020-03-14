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
}
