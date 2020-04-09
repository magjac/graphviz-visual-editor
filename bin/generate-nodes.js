#! /usr/bin/env node

var hpccWasm = require("../node_modules/@hpcc-js/wasm/dist/index");
var fs_promises = require("fs").promises;

global.fetch = function(filename) {
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


shapes = [
  "box",
  "polygon",
  "ellipse",
  "oval",
  "circle",
  "point",
  "egg",
  "triangle",
  "none",
  "plaintext",
  "plain",
  "diamond",
  "trapezium",
  "parallelogram",
  "house",
  "pentagon",
  "hexagon",
  "septagon",
  "octagon",
  "note",
  "tab",
  "folder",
  "box3d",
  "component",
  "cylinder",
  "rect",
  "rectangle",
  "square",
  "doublecircle",
  "doubleoctagon",
  "tripleoctagon",
  "invtriangle",
  "invtrapezium",
  "invhouse",
  "underline",
  "Mdiamond",
  "Msquare",
  "Mcircle",
  /* non-convex polygons */
  /* biological circuit shapes, as specified by SBOLv*/
  /** gene expression symbols **/
  "promoter",
  "cds",
  "terminator",
  "utr",
  "insulator",
  "ribosite",
  "rnastab",
  "proteasesite",
  "proteinstab",
  /** dna construction symbols **/
  "primersite",
  "restrictionsite",
  "fivepoverhang",
  "threepoverhang",
  "noverhang",
  "assembly",
  "signature",
  "rpromoter",
  "larrow",
  "rarrow",
  "lpromoter",
  /*  *** shapes other than polygons  *** */
  "record",
  "Mrecord",
//  "epsf",
  "star",
];

console.log('const shapes = {');

hpccWasm.graphvizSync().then(graphviz => {
  for (i = 0; i < shapes.length; i++) {

    shape = shapes[i];

    dotSrc = `digraph "" {
      ${shape} [shape=${shape} style=filled label=""]
    }`;

    var svg = graphviz.layout(dotSrc, 'svg', 'dot');

    console.log(`${shape}: \`${svg}\`,`);
  }

  dotSrc = `digraph "" {
    "(default)" [style="filled, dashed" fillcolor="white" label=""]
  }`;

  var svg = graphviz.layout(dotSrc, 'svg' , 'dot');

  console.log(`'(default)': \`${svg}\`,`);

  console.log('};');
  console.log('');
  console.log('export {shapes};');
});
