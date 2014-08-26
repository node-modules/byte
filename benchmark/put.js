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
.add('put(<Buffer 61>)', function () {
  putBytes.put(src, 0, 1);
})
.add('putChar(0, "a")', function () {
  putCharBytes.putChar(0, 'a');
})
.add('putChar(0, 97)', function () {
  putCharNumBytes.putChar(0, 97);
})
.add('putChar("a")', function () {
  putCharBytes._offset = 0;
  putCharBytes.putChar('a');
})
.add('putChar(97)', function () {
  putCharNumBytes._offset = 0;
  putCharNumBytes.putChar(97);
})
.add('buf.writeUInt16BE(0, 1)', function () {
  buf.writeUInt16BE(1, 0);
})
.add('buf[uint16BE](0, 1)', function () {
  var uint16BE = 'writeUInt16BE';
  buf[uint16BE](1, 0);
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

  // buf[0] = 97                                x 75,501,118 ops/sec ±2.29% (89 runs sampled)
  // put(0, 97)                                 x 76,489,133 ops/sec ±1.68% (93 runs sampled)
  // copy[0] = 97                               x 11,259,189 ops/sec ±2.01% (91 runs sampled)
  // put(<Buffer 61>)                           x 10,826,427 ops/sec ±1.68% (92 runs sampled)
  // putChar(0, "a")                            x 77,247,378 ops/sec ±1.74% (94 runs sampled)
  // putChar(0, 97)                             x 70,058,699 ops/sec ±2.18% (92 runs sampled)
  // putChar("a")                               x 63,099,885 ops/sec ±0.75% (94 runs sampled)
  // putChar(97)                                x 62,164,356 ops/sec ±1.38% (95 runs sampled)
  // putShort(0, 1)                             x 19,918,200 ops/sec ±1.03% (95 runs sampled)
  // putInt(0, 1)                               x  7,027,621 ops/sec ±6.70% (91 runs sampled)
  // putFloat(0, 1)                             x 10,104,306 ops/sec ±1.04% (91 runs sampled)
  // putDouble(0, 1)                            x 10,157,512 ops/sec ±1.10% (95 runs sampled)
  // putLong(0, 100000)                         x 26,364,254 ops/sec ±0.94% (93 runs sampled)
  // putSmallSLong(0, "10000")                  x 13,080,481 ops/sec ±1.18% (91 runs sampled)
  // putBigNumLong(0, 34359738368)              x  7,608,611 ops/sec ±1.17% (90 runs sampled)
  // putSafeStrLong(0, "34359738368")           x  4,070,055 ops/sec ±0.88% (93 runs sampled)
  // putStrLong(0, "9223372036854775808")       x    985,469 ops/sec ±0.89% (95 runs sampled)
  // ByteBuffer.allocate(100).putString(0, str) x    149,300 ops/sec ±1.60% (86 runs sampled)
  // putString(0, str)                          x    914,022 ops/sec ±3.70% (90 runs sampled)
  // bytes.putString(str)                       x    973,302 ops/sec ±0.72% (97 runs sampled)
  // putString(0, buf)                          x  2,535,609 ops/sec ±0.93% (94 runs sampled)
  // bytes.putString(buf)                       x  2,570,024 ops/sec ±3.20% (97 runs sampled)
  // putRawString(0, str)                       x  2,514,063 ops/sec ±0.74% (98 runs sampled)
  // bytes.putRawString(str)                    x  1,479,018 ops/sec ±0.76% (96 runs sampled)
  // bytes.putRawString(str).array()            x    325,139 ops/sec ±1.71% (83 runs sampled)
  // bytes.putRawString(str).array(0, 100)      x    333,073 ops/sec ±1.72% (85 runs sampled)


  // node version: v0.10.31, date: Mon Aug 25 2014 22:21:22 GMT+0800 (CST)
  // Starting...

  // buf[0] = 97      x 81,416,619 ops/sec ±2.65% (90 runs sampled)
  // put(0, 97)       x 39,789,758 ops/sec ±1.48% (92 runs sampled)
  // copy[0] = 97     x  7,876,033 ops/sec ±2.53% (96 runs sampled)
  // put(<Buffer 61>) x  6,758,320 ops/sec ±1.45% (91 runs sampled)
  // putChar(0, "a")  x 42,881,892 ops/sec ±0.60% (92 runs sampled)
  // putChar(0, 97)   x 41,615,714 ops/sec ±2.85% (75 runs sampled)
  // putChar("a")     x 33,757,160 ops/sec ±1.78% (92 runs sampled)
  // putChar(97)      x 36,055,373 ops/sec ±0.85% (97 runs sampled)

  // node version: v0.11.12, date: Mon Aug 25 2014 22:23:09 GMT+0800 (CST)
  // Starting...

  // buf[0] = 97      x 83,861,096 ops/sec ±1.38% (91 runs sampled)
  // put(0, 97)       x 46,275,837 ops/sec ±1.50% (94 runs sampled)
  // copy[0] = 97     x 11,822,231 ops/sec ±2.10% (91 runs sampled)
  // put(<Buffer 61>) x 10,097,220 ops/sec ±2.56% (87 runs sampled)
  // putChar(0, "a")  x 47,841,231 ops/sec ±1.71% (91 runs sampled)
  // putChar(0, 97)   x 52,257,064 ops/sec ±1.18% (93 runs sampled)
  // putChar("a")     x 37,559,642 ops/sec ±1.52% (94 runs sampled)
  // putChar(97)      x 40,511,953 ops/sec ±0.87% (96 runs sampled)
