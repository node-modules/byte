/**!
 * byte - benchmark/get.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 *   dead-horse <dead_horse@qq.com> (https://github.com/dead-horse)
 */

'use strict';

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
var putStringBytes = ByteBuffer.allocate(104);
var putCStringBytes = ByteBuffer.allocate(105);
var putBufStringBytes = ByteBuffer.allocate(104);
var putRawStringBytes = ByteBuffer.allocate(104);

var bytes = ByteBuffer.allocate(1024 * 1024);

var string = '';
while(string.length < 100) {
  string += 'fffff';
}
var bufString = new Buffer(100);

putBytes.put(0, 1);
putCharBytes.putChar(0, 'a');
putCharBytes.putChar(0, 61);
putShortBytes.putShort(0, 1);
putIntBytes.putInt(0, 1);
putFloatBytes.putFloat(0, 1);
putDoubleBytes.putDouble(0, 1);
putLongBytes.putLong(0, 100000);
putLongBytes.putLong(0, '10000');
putLongBytes.putLong(0, 34359738368);
putLongBytes.putLong(0, "34359738368");
putLongBytes.putLong(0, '9223372036854775808');
ByteBuffer.allocate(100).putString(0, string);
putStringBytes.putString(0, string);
putCStringBytes.putCString(0, string);
putBufStringBytes.putString(0, bufString);
putRawStringBytes.putRawString(0, string);

putStringBytes.reset();
// putStringBytes.skip(4);
// console.log(putStringBytes.getString(0) === putStringBytes.readRawString(100));
// putStringBytes.reset();
//
// console.log(putStringBytes.getString(0) === putStringBytes.readRawString(4, 100));
// console.log(putStringBytes.getString(0) === putCStringBytes.getCString(0));

suite
.add('_offset = 0', function () {
  putBytes._offset = 0;
})
.add('position(0)', function () {
  putBytes.position(0);
})
.add('position()', function () {
  putBytes.position();
})
.add('_bytes.copy(0, 1)', function () {
  var buf = new Buffer(1);
  putBytes._bytes.copy(buf, 0, 0, 1);
})
.add('get(0, 1) => copy Buffer', function () {
  putBytes.get(0, 1);
})
.add('get(0, 100) => copy Buffer', function () {
  bytes.get(0, 100);
})
.add('get(0, 4096) => copy Buffer', function () {
  bytes.get(0, 4096);
})
.add('_bytes[i]', function () {
  putBytes._bytes[0];
})
.add('get() => byte', function () {
  putBytes._offset = 0;
  putBytes.get();
})
.add('get(0) => byte', function () {
  putBytes.get(0);
})
.add('getChar(0)', function () {
  putCharBytes.getChar(0);
})
.add('_bytes.readUInt16BE', function () {
  putShortBytes._bytes.readUInt16BE(0);
})
.add('getShort(0)', function () {
  putShortBytes.getShort(0);
})
.add('getShort()', function () {
  putShortBytes._offset = 0;
  putShortBytes.getShort();
})
.add('getInt(0)', function () {
  putIntBytes.getInt(0);
})
.add('getFloat(0)', function () {
  putFloatBytes.getFloat(0);
})
.add('getDouble(0)', function () {
  putDoubleBytes.getDouble(0);
})
.add('getLong(0)', function () {
  putLongBytes.getLong(0);
})
.add('getString(0)', function () {
  putStringBytes.getString(0);
})
.add('getCString(0)', function () {
  putCStringBytes.getCString(0);
})
.add('readRawString(4, 100)', function () {
  putStringBytes.readRawString(4, 100);
})
.add('readRawString(100)', function () {
  putStringBytes.reset();
  putStringBytes.skip(4);
  putStringBytes.readRawString(100);
})
.add('getRawString(0, 100)', function () {
  putRawStringBytes.getRawString(0, 100);
})
.add('getRawStringByStringLength(0, 100)', function () {
  putRawStringBytes.getRawStringByStringLength(0, 100);
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

// node version: v8.9.0, date: Thu Nov 16 2017 12:27:51 GMT+0800 (CST)
// Starting...
// 24 tests completed.
//
// _offset = 0                        x 1,313,398,169 ops/sec ±1.69% (92 runs sampled)
// position(0)                        x   154,052,896 ops/sec ±1.90% (91 runs sampled)
// position()                         x   234,018,744 ops/sec ±12.30% (91 runs sampled)
// _bytes.copy(0, 1)                  x     1,359,434 ops/sec ±1.75% (89 runs sampled)
// get(0, 1) => copy Buffer           x     1,318,288 ops/sec ±2.01% (86 runs sampled)
// get(0, 100) => copy Buffer         x     1,122,101 ops/sec ±1.07% (77 runs sampled)
// get(0, 4096) => copy Buffer        x       360,451 ops/sec ±3.04% (84 runs sampled)
// _bytes[i]                          x   668,005,958 ops/sec ±1.15% (94 runs sampled)
// get() => byte                      x   139,503,339 ops/sec ±0.94% (92 runs sampled)
// get(0) => byte                     x   145,565,421 ops/sec ±0.88% (94 runs sampled)
// getChar(0)                         x   146,359,082 ops/sec ±0.90% (94 runs sampled)
// _bytes.readUInt16BE                x   135,816,353 ops/sec ±0.97% (93 runs sampled)
// getShort(0)                        x   122,965,917 ops/sec ±1.09% (93 runs sampled)
// getShort()                         x   118,434,346 ops/sec ±0.93% (90 runs sampled)
// getInt(0)                          x    23,725,763 ops/sec ±1.15% (91 runs sampled)
// getFloat(0)                        x    10,082,681 ops/sec ±0.95% (93 runs sampled)
// getDouble(0)                       x     9,406,714 ops/sec ±2.16% (92 runs sampled)
// getLong(0)                         x    62,055,693 ops/sec ±1.69% (92 runs sampled)
// getString(0)                       x     5,086,919 ops/sec ±1.53% (93 runs sampled)
// getCString(0)                      x     5,088,544 ops/sec ±1.07% (91 runs sampled)
// readRawString(4, 100)              x     6,293,722 ops/sec ±1.12% (90 runs sampled)
// readRawString(100)                 x     6,189,186 ops/sec ±1.02% (90 runs sampled)
// getRawString(0, 100)               x     1,232,435 ops/sec ±1.23% (89 runs sampled)
// getRawStringByStringLength(0, 100) x     1,203,666 ops/sec ±1.34% (94 runs sampled)
