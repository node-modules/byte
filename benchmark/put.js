/**!
 * byte - benchmark/put.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 *   dead-horse <dead_horse@qq.com> (https://github.com/dead-horse)
 */

"use strict";

/**
 * Module dependencies.
 */

var Benchmark = require('benchmark');
var benchmarks = require('beautify-benchmark');
var ByteBuffer = require('../');

var suite = new Benchmark.Suite();

var putBytes = ByteBuffer.allocate(1);
var putCharBytes = ByteBuffer.allocate(1);
var putCharNumBytes = ByteBuffer.allocate(1);
var putShortBytes = ByteBuffer.allocate(2);
var putIntBytes = ByteBuffer.allocate(4);
var putFloatBytes = ByteBuffer.allocate(4);
var putDoubleBytes = ByteBuffer.allocate(8);
var putLongBytes = ByteBuffer.allocate(8);
var putBigLongBytes = ByteBuffer.allocate(8);
var putStringBytes = ByteBuffer.allocate(100);
var putBufStringBytes = ByteBuffer.allocate(100);
var putRawStringBytes = ByteBuffer.allocate(100);

var bytes = ByteBuffer.allocate(1024 * 1024);

var string = '';
while(string.length < 100) {
  string += 'fffff';
}
var bufString = new Buffer(100);

var buf = new Buffer(10);
var src = new Buffer([0x61, 0x62, 0x63]);

suite
.add('buf[0] = 97', function () {
  buf[0] = 97;
})
.add('put(0, 97)', function () {
  putBytes.put(0, 97);
})
.add('copy[0] = 97', function () {
  src.copy(buf, 0, 0, 1);
})
.add('putBuffer(0, <Buffer 61>)', function () {
  putBytes.putBuffer(0, src, 0, 1);
})
.add('putChar(0, "a")', function () {
  putCharBytes.putChar(0, 'a');
})
.add('putChar(0, 97)', function () {
  putCharNumBytes.putChar(0, 97);
})
.add('putChar("a")', function () {
  putCharBytes.putChar('a');
})
.add('putChar(97)', function () {
  putCharNumBytes.putChar(97);
})
.add('putShort(0, 1)', function () {
  putShortBytes.putShort(0, 1);
})
.add('putInt(0, 1)', function () {
  putIntBytes.putInt(0, 1);
})
.add('putFloat(0, 1)', function () {
  putFloatBytes.putFloat(0, 1);
})
.add('putDouble(0, 1)', function () {
  putDoubleBytes.putDouble(0, 1);
})
.add('putLong(0, 100000)', function () {
  putLongBytes.putLong(0, 100000);
})
.add('putSmallSLong(0, "10000") ', function () {
  putLongBytes.putLong(0, '10000');
})
.add('putBigNumLong(0, 34359738368) ', function () {
  putLongBytes.putLong(0, 34359738368);
})
.add('putSafeStrLong(0, "34359738368")', function () {
  putLongBytes.putLong(0, "34359738368");
})
.add('putStrLong(0, "9223372036854775808")', function () {
  putLongBytes.putLong(0, '9223372036854775808');
})
.add('ByteBuffer.allocate(100).putString(0, str)', function () {
  ByteBuffer.allocate(100).putString(0, string);
})
.add('putString(0, str)', function () {
  putStringBytes.putString(0, string);
})
.add('bytes.putString(str)', function () {
  bytes.reset();
  bytes.putString(string);
})
.add('putString(0, buf)', function () {
  putBufStringBytes.putString(0, bufString);
})
.add('bytes.putString(buf)', function () {
  bytes.reset();
  bytes.putString(bufString);
})
.add('putRawString(0, str)', function () {
  putRawStringBytes.putRawString(0, string);
})
.add('bytes.putRawString(str)', function () {
  bytes.reset();
  bytes.putRawString(string);
})
.add('bytes.putRawString(str).array()', function () {
  bytes.reset();
  bytes.putRawString(string).array();
})
.add('bytes.putRawString(str).array(0, 100)', function () {
  bytes.reset();
  bytes.putRawString(string).array(0, 100);
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

  // node version: v0.11.13, date: Mon Aug 25 2014 20:53:00 GMT+0800 (CST)
  // Starting...
  // 26 tests completed.

  // buf[0] = 97                                x 84,635,292 ops/sec ±2.52% (92 runs sampled)
  // put(0, 97)                                 x 79,838,465 ops/sec ±1.68% (96 runs sampled)
  // copy[0] = 97                               x 11,999,602 ops/sec ±1.07% (93 runs sampled)
  // putBuffer(0, <Buffer 61>)                  x 11,057,277 ops/sec ±0.64% (96 runs sampled)
  // putChar(0, "a")                            x 79,879,315 ops/sec ±1.41% (95 runs sampled)
  // putChar(0, 97)                             x 70,565,032 ops/sec ±1.81% (93 runs sampled)
  // putChar("a")                               x 19,361,166 ops/sec ±11.06% (86 runs sampled)
  // putChar(97)                                x 15,251,731 ops/sec ±1.32% (48 runs sampled)
  // putShort(0, 1)                             x 20,484,781 ops/sec ±1.03% (93 runs sampled)
  // putInt(0, 1)                               x  7,993,369 ops/sec ±8.83% (92 runs sampled)
  // putFloat(0, 1)                             x  9,646,213 ops/sec ±0.74% (99 runs sampled)
  // putDouble(0, 1)                            x  9,685,708 ops/sec ±0.51% (99 runs sampled)
  // putLong(0, 100000)                         x 26,825,432 ops/sec ±0.78% (99 runs sampled)
  // putSmallSLong(0, "10000")                  x 16,357,843 ops/sec ±0.79% (97 runs sampled)
  // putBigNumLong(0, 34359738368)              x  9,969,444 ops/sec ±0.77% (94 runs sampled)
  // putSafeStrLong(0, "34359738368")           x  4,633,738 ops/sec ±0.72% (98 runs sampled)
  // putStrLong(0, "9223372036854775808")       x    970,579 ops/sec ±0.82% (99 runs sampled)
  // ByteBuffer.allocate(100).putString(0, str) x    151,029 ops/sec ±1.55% (88 runs sampled)
  // putString(0, str)                          x    756,345 ops/sec ±0.77% (97 runs sampled)
  // bytes.putString(str)                       x    760,108 ops/sec ±0.60% (98 runs sampled)
  // putString(0, buf)                          x  3,308,635 ops/sec ±5.37% (96 runs sampled)
  // bytes.putString(buf)                       x  2,203,119 ops/sec ±0.91% (97 runs sampled)
  // putRawString(0, str)                       x  2,354,233 ops/sec ±0.79% (96 runs sampled)
  // bytes.putRawString(str)                    x  1,389,442 ops/sec ±0.86% (96 runs sampled)
  // bytes.putRawString(str).array()            x    294,978 ops/sec ±1.87% (87 runs sampled)
  // bytes.putRawString(str).array(0, 100)      x    320,174 ops/sec ±1.71% (87 runs sampled)
