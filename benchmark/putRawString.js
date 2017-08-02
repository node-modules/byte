'use strict';

var bench = require('fastbench');
var ByteBuffer = require('..');

var bb = ByteBuffer.allocate(1024);
var max = 10;

bb.putRawString(makeStr('a', 200), '2.0');
console.log('bytes %s', bb.array().length);
bb.reset();

var run = bench([
  function putRawString(cb) {
    for (var i = 0; i < max; i++) {
      bb.putRawString(makeStr('a', 200), '2.0');
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },
], 10000);

run(run);

function makeStr(str, concats) {
  var s = ''
  while (concats--) {
    s += str
  }
  return s
}

// before:
// putRawString*10000: 912.743ms
// putRawString*10000: 869.517ms

// after:
// putRawString*10000: 502.805ms
// putRawString*10000: 489.996ms
