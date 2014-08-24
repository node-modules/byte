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
.add('putChar("0, a")', function () {
  putCharBytes.putChar(0, 'a');
})
.add('copy[0] = 97', function () {
  src.copy(buf, 0, 0, 1);
})
.add('putBuffer(0, <Buffer 61>)', function () {
  putBytes.putBuffer(0, src, 0, 1);
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

//   node version: v0.11.12, date: Mon May 12 2014 18:25:35 GMT+0800 (CST)
//   Starting...
//   20 tests completed.
//
//   put()                                      x 29,971,599 ops/sec ±4.10% (96 runs sampled)
//   putChar("a")                               x 27,950,189 ops/sec ±6.22% (80 runs sampled)
//   putChar(61)                                x 34,798,492 ops/sec ±5.08% (81 runs sampled)
//   putShort()                                 x 25,264,781 ops/sec ±2.90% (88 runs sampled)
//   putInt()                                   x 21,368,588 ops/sec ±6.07% (85 runs sampled)
//   putFloat()                                 x 12,324,148 ops/sec ±2.04% (93 runs sampled)
//   putDouble()                                x 13,374,686 ops/sec ±1.41% (92 runs sampled)
//   putLong(100000)                            x 17,754,878 ops/sec ±5.16% (86 runs sampled)
//   putSmallSLong("10000")                     x  7,732,989 ops/sec ±2.07% (92 runs sampled)
//   putBigNumLong(34359738368)                 x  3,580,231 ops/sec ±2.58% (93 runs sampled)
//   putSafeStrLong("34359738368")              x  2,443,560 ops/sec ±2.04% (97 runs sampled)
//   putStrLong("9223372036854775808")          x    760,908 ops/sec ±2.42% (92 runs sampled)
//   ByteBuffer.allocate(100).putString(0, str) x    608,403 ops/sec ±11.46% (70 runs sampled)
//   putString(0, str)                          x  1,362,412 ops/sec ±8.55% (85 runs sampled)
//   bytes.putString(str)                       x  1,506,610 ops/sec ±2.31% (94 runs sampled)
//   putString(0, buf)                          x  5,947,594 ops/sec ±4.16% (90 runs sampled)
//   bytes.putString(buf)                       x  5,741,251 ops/sec ±1.69% (95 runs sampled)
//   putRawString(0, str)                       x  2,908,161 ops/sec ±1.81% (95 runs sampled)
//   bytes.putRawString(str)                    x  1,527,089 ops/sec ±4.98% (86 runs sampled)
//   bytes.putRawString(str).array()            x  1,009,026 ops/sec ±2.38% (91 runs sampled)
