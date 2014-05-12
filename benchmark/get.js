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

.add('get(0, 1) => copy Buffer', function () {
  putBytes.get(0, 1);
})
.add('get(0, 100) => copy Buffer', function () {
  bytes.get(0, 100);
})
.add('get(0, 4096) => copy Buffer', function () {
  bytes.get(0, 4096);
})
.add('get() => byte', function () {
  putBytes.get();
})
.add('getChar(0)', function () {
  putCharBytes.getChar(0);
})
.add('getShort(0)', function () {
  putShortBytes.getShort(0);
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

// node version: v0.11.12, date: Mon May 12 2014 19:14:26 GMT+0800 (CST)
// Starting...
// 15 tests completed.
//
// get(0, 1) => copy Buffer    x  2,059,464 ops/sec ±9.18% (69 runs sampled)
// get(0, 100) => copy Buffer  x  2,124,455 ops/sec ±4.98% (75 runs sampled)
// get(0, 4096) => copy Buffer x    356,927 ops/sec ±9.43% (56 runs sampled)
// get() => byte               x 15,477,897 ops/sec ±3.05% (89 runs sampled)
// getChar(0)                  x 52,541,591 ops/sec ±1.04% (95 runs sampled)
// getShort(0)                 x 26,297,086 ops/sec ±2.46% (89 runs sampled)
// getInt(0)                   x 18,772,003 ops/sec ±6.27% (71 runs sampled)
// getFloat(0)                 x 13,132,298 ops/sec ±1.68% (97 runs sampled)
// getDouble(0)                x 10,968,594 ops/sec ±1.27% (94 runs sampled)
// getLong(0)                  x 11,849,374 ops/sec ±2.63% (96 runs sampled)
// getString(0)                x  2,358,382 ops/sec ±5.78% (76 runs sampled)
// getCString(0)               x  1,618,356 ops/sec ±8.41% (72 runs sampled)
// readRawString(4, 100)       x  4,790,991 ops/sec ±9.25% (79 runs sampled)
// readRawString(100)          x  5,434,663 ops/sec ±1.32% (95 runs sampled)
// getRawString(0, 100)        x  5,497,325 ops/sec ±1.02% (98 runs sampled)
