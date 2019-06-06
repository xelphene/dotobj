
'use strict';

const expand = require('../index.js').expand;
const collapse = require('../index.js').collapse;

var o = {
    'a.x': 11,
    'a.y': 12,
    'a':   10,
    'b':   21
}

var e = expand(o);
console.log(e);

var c = collapse(e);

console.log(c);
console.log(o);

