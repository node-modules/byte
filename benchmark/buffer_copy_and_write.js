/**!
 * byte - benchmark/buffer_copy_and_write.js
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

var buffer = new Buffer(1024 * 5);
buffer.fill(74);
var str = buffer.toString();
var buf = new Buffer(buffer.length);

suite
.add('5k str => buffer and buf.copy(5k buf)', function () {
  var b = new Buffer(str);
  b.copy(buf, 0);
})
.add('buf.write(5k str)', function () {
  buf.write(str, 0);
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

// node version: v0.11.12, date: Thu May 22 2014 21:53:56 GMT+0800 (CST)
// Starting...
// 2 tests completed.
//
// 5k str => buffer and buf.copy(5k buf) x  90,912 ops/sec ±13.27% (67 runs sampled)
// buf.write(5k str)                     x 354,964 ops/sec ±0.80% (94 runs sampled)
