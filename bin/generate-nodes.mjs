#! /usr/bin/env node

import { graphviz } from "@hpcc-js/wasm";

const shapes = [
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

for (let i = 0; i < shapes.length; i++) {

  const shape = shapes[i];

  const dotSrc = `digraph "" {
    ${shape} [shape=${shape} style=filled label=""]
  }`;

  var svg = await graphviz.layout(dotSrc, 'svg', 'dot');

  console.log(`${shape}: \`${svg}\`,`);
}

const dotSrc = `digraph "" {
  "(default)" [style="filled, dashed" fillcolor="white" label=""]
}`;

var svg = await graphviz.layout(dotSrc, 'svg' , 'dot');

console.log(`'(default)': \`${svg}\`,`);

console.log('};');
console.log('');
console.log('export {shapes};');
