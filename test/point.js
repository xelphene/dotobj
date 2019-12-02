
'use strict';

const expand = require('../index.js').expand;
const collapse = require('../index.js').collapse;

const Point = require('octogeom').point.Point;

var o = {
    'p':   new Point(10,20)
}

console.log(o);
var e = expand(o);
console.log(e);
