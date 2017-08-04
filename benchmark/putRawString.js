'use strict';

var bench = require('fastbench');
var ByteBuffer = require('..');

var largeStr = JSON.stringify(require('../package.json'))
largeStr += largeStr
largeStr += largeStr

var bb = ByteBuffer.allocate(1024);
var max = 10;

bb.putRawString(makeStr('a', 200));
console.log('small bytes %s', bb.array().length);
bb.reset();

bb.putRawString(makeStr(largeStr, 10));
console.log('large bytes %s', bb.array().length);
bb.reset();

var run = bench([
  function putRawStringSmall(cb) {
    for (var i = 0; i < max; i++) {
      bb.putRawString(makeStr('a', 200));
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },
  // function putRawStringLarge(cb) {
  //   for (var i = 0; i < max; i++) {
  //     bb.putRawString(makeStr(largeStr, 10));
  //   }
  //   bb.array();
  //   bb.reset();
  //   setImmediate(cb);
  // },
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
// putRawStringSmall*10000: 912.743ms
// putRawStringSmall*10000: 869.517ms

// after:
// putRawStringSmall*10000: 502.805ms
// putRawStringSmall*10000: 489.996ms
