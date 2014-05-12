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

.add('get(0, 1) => slice', function () {
  putBytes.get(0, 1);
})
.add('get(0) => byte', function () {
  putBytes.get(0);
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

// node version: v0.11.12, date: Mon May 12 2014 19:00:16 GMT+0800 (CST)
// Starting...
// 14 tests completed.
//
// get(0, 1) => slice    x  2,632,680 ops/sec ±4.31% (87 runs sampled)
// get(0) => byte        x 41,925,551 ops/sec ±1.25% (95 runs sampled)
// get() => byte         x 15,803,259 ops/sec ±3.35% (88 runs sampled)
// getChar(0)            x 39,863,065 ops/sec ±6.93% (78 runs sampled)
// getShort(0)           x 25,271,617 ops/sec ±3.89% (83 runs sampled)
// getInt(0)             x 25,692,849 ops/sec ±3.25% (94 runs sampled)
// getFloat(0)           x 10,771,179 ops/sec ±1.62% (93 runs sampled)
// getDouble(0)          x 12,165,312 ops/sec ±4.28% (90 runs sampled)
// getLong(0)            x 11,782,216 ops/sec ±1.20% (94 runs sampled)
// getString(0)          x  2,603,237 ops/sec ±3.30% (84 runs sampled)
// getCString(0)         x  1,626,756 ops/sec ±8.48% (74 runs sampled)
// readRawString(4, 100) x  5,811,111 ops/sec ±1.35% (94 runs sampled)
// readRawString(100)    x  5,239,786 ops/sec ±1.23% (97 runs sampled)
// getRawString(0, 100)  x  5,453,482 ops/sec ±1.90% (93 runs sampled)
