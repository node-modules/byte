/**!
 * byte - write_int_and_set_bit.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var Benchmark = require('benchmark');
var benchmarks = require('beautify-benchmark');

var suite = new Benchmark.Suite();

var buf = new Buffer(4);

buf.writeUInt32BE(0);
console.log(buf);
buf.writeUInt32BE(0xffffffff);
console.log(buf);

function fill(buf, index, val) {
  buf[index] = val;
  buf[index + 1] = val;
  buf[index + 2] = val;
  buf[index + 3] = val;
}
fill(buf, 0, 0);
console.log(buf);
fill(buf, 0, 0xff);
console.log(buf);

suite
.add('buf.writeUInt32BE(0)', function () {
  buf.writeUInt32BE(0);
})
.add('buf.writeUInt32BE(0xffffffff)', function () {
  buf.writeUInt32BE(0xffffffff);
})
.add('buf[index] = val', function () {
  var index = 0;
  var val = 0;
  buf[index] = val;
  buf[index + 1] = val;
  buf[index + 2] = val;
  buf[index + 3] = val;
})
.add('fill(buf, 0, 0)', function () {
  fill(buf, 0, 0);
})
.add('fill(buf, 0, 0xff)', function () {
  fill(buf, 0, 0xff);
})

.on('cycle', function(event) {
  benchmarks.add(event.target);
})
.on('start', function(event) {
  console.log('\n  node version: %s, date: %s\n  Starting...', process.version, Date());
})
.on('complete', function done() {
  benchmarks.log();
})
.run({ 'async': false });

// node version: v0.11.12, date: Fri May 23 2014 09:37:02 GMT+0800 (CST)
// Starting...
// 5 tests completed.
//
// buf.writeUInt32BE(0)          x 22,895,434 ops/sec ±4.75% (77 runs sampled)
// buf.writeUInt32BE(0xffffffff) x 22,775,580 ops/sec ±3.02% (80 runs sampled)
// buf[index] = val              x 57,723,682 ops/sec ±2.30% (88 runs sampled)
// fill(buf, 0, 0)               x 50,284,131 ops/sec ±1.93% (84 runs sampled)
// fill(buf, 0, 0xff)            x 51,189,455 ops/sec ±2.30% (82 runs sampled)
