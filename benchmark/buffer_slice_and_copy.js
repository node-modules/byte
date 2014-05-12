/*!
 * byte - benchmark/buffer_slice_and_copy.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var Benchmark = require('benchmark');
var benchmarks = require('beautify-benchmark');

var suite = new Benchmark.Suite();

var buffer = new Buffer(1024 * 1024);

suite
.add('buffer.slice(0, 100)', function () {
  buffer.slice(0, 100);
})
.add('buffer.slice(0, 512)', function () {
  buffer.slice(0, 512);
})
.add('buffer.slice(0, 1024)', function () {
  buffer.slice(0, 1024);
})
.add('buffer.slice(0, 2048)', function () {
  buffer.slice(0, 2048);
})
.add('buffer.slice(0, 3072)', function () {
  buffer.slice(0, 3072);
})
.add('buffer.slice(0, 4096)', function () {
  buffer.slice(0, 4096);
})
.add('buffer.slice(0, 10240)', function () {
  buffer.slice(0, 10240);
})
.add('buffer.slice(0, 20480)', function () {
  buffer.slice(0, 20480);
})
.add('buffer.slice(0, 102400)', function () {
  buffer.slice(0, 102400);
})
.add('buffer.slice(0, 1024000)', function () {
  buffer.slice(0, 1024000);
})

.add('buffer.copy(buf, 0, 0, 100)', function () {
  var buf = new Buffer(100);
  buffer.copy(buf, 0, 0, 100);
})
.add('buffer.copy(buf, 0, 0, 512)', function () {
  var buf = new Buffer(512);
  buffer.copy(buf, 0, 0, 512);
})
.add('buffer.copy(buf, 0, 0, 1024)', function () {
  var buf = new Buffer(1024);
  buffer.copy(buf, 0, 0, 1024);
})
.add('buffer.copy(buf, 0, 0, 2048)', function () {
  var buf = new Buffer(2048);
  buffer.copy(buf, 0, 0, 2048);
})
.add('buffer.copy(buf, 0, 0, 3072)', function () {
  var buf = new Buffer(3072);
  buffer.copy(buf, 0, 0, 3072);
})
.add('buffer.copy(buf, 0, 0, 4096)', function () {
  var buf = new Buffer(4096);
  buffer.copy(buf, 0, 0, 4096);
})
.add('buffer.copy(buf, 0, 0, 10240)', function () {
  var buf = new Buffer(10240);
  buffer.copy(buf, 0, 0, 10240);
})
.add('buffer.copy(buf, 0, 0, 20480)', function () {
  var buf = new Buffer(20480);
  buffer.copy(buf, 0, 0, 20480);
})
.add('buffer.copy(buf, 0, 0, 102400)', function () {
  var buf = new Buffer(102400);
  buffer.copy(buf, 0, 0, 102400);
})
.add('buffer.copy(buf, 0, 0, 1024000)', function () {
  var buf = new Buffer(1024000);
  buffer.copy(buf, 0, 0, 1024000);
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

// node version: v0.11.12, date: Mon May 12 2014 19:27:06 GMT+0800 (CST)
// Starting...
// 20 tests completed.
//
// buffer.slice(0, 100)            x   427,521 ops/sec ±5.07% (74 runs sampled)
// buffer.slice(0, 512)            x   493,018 ops/sec ±1.30% (85 runs sampled)
// buffer.slice(0, 1024)           x   475,060 ops/sec ±1.80% (88 runs sampled)
// buffer.slice(0, 2048)           x   461,284 ops/sec ±2.57% (86 runs sampled)
// buffer.slice(0, 3072)           x   472,213 ops/sec ±0.89% (96 runs sampled)
// buffer.slice(0, 4096)           x   471,660 ops/sec ±1.07% (88 runs sampled)
// buffer.slice(0, 10240)          x   389,205 ops/sec ±6.74% (67 runs sampled)
// buffer.slice(0, 20480)          x   458,807 ops/sec ±1.56% (81 runs sampled)
// buffer.slice(0, 102400)         x   456,705 ops/sec ±1.65% (86 runs sampled)
// buffer.slice(0, 1024000)        x   450,420 ops/sec ±3.29% (77 runs sampled)
// buffer.copy(buf, 0, 0, 100)     x 2,531,363 ops/sec ±2.50% (88 runs sampled)
// buffer.copy(buf, 0, 0, 512)     x 1,508,503 ops/sec ±1.31% (79 runs sampled)
// buffer.copy(buf, 0, 0, 1024)    x   987,696 ops/sec ±3.22% (82 runs sampled)
// buffer.copy(buf, 0, 0, 2048)    x   633,546 ops/sec ±1.38% (52 runs sampled)
// buffer.copy(buf, 0, 0, 3072)    x   383,560 ops/sec ±1.78% (87 runs sampled)
// buffer.copy(buf, 0, 0, 4096)    x   373,935 ops/sec ±1.21% (52 runs sampled)
// buffer.copy(buf, 0, 0, 10240)   x   240,279 ops/sec ±4.26% (64 runs sampled)
// buffer.copy(buf, 0, 0, 20480)   x   117,997 ops/sec ±1.72% (62 runs sampled)
// buffer.copy(buf, 0, 0, 102400)  x    24,906 ops/sec ±2.23% (66 runs sampled)
// buffer.copy(buf, 0, 0, 1024000) x     1,352 ops/sec ±6.61% (72 runs sampled)
