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

// $ node benchmark/buffer_slice_and_copy.js
//
//
//   node version: v0.11.12, date: Mon May 12 2014 18:23:57 GMT+0800 (CST)
//   Starting...
//   12 tests completed.
//
//   buffer.slice(0, 100)         x   369,204 ops/sec ±12.12% (66 runs sampled)
//   buffer.slice(0, 512)         x   474,911 ops/sec ±3.44% (83 runs sampled)
//   buffer.slice(0, 1024)        x   473,549 ops/sec ±3.34% (80 runs sampled)
//   buffer.slice(0, 2048)        x   461,564 ops/sec ±3.49% (83 runs sampled)
//   buffer.slice(0, 3072)        x   466,174 ops/sec ±3.10% (82 runs sampled)
//   buffer.slice(0, 4096)        x   455,557 ops/sec ±3.09% (86 runs sampled)
//   buffer.copy(buf, 0, 0, 100)  x 2,370,427 ops/sec ±4.38% (82 runs sampled)
//   buffer.copy(buf, 0, 0, 512)  x 1,695,575 ops/sec ±5.65% (69 runs sampled)
//   buffer.copy(buf, 0, 0, 1024) x 1,130,918 ops/sec ±6.23% (64 runs sampled)
//   buffer.copy(buf, 0, 0, 2048) x   599,029 ops/sec ±9.90% (56 runs sampled)
//   buffer.copy(buf, 0, 0, 3072) x   394,211 ops/sec ±4.68% (53 runs sampled)
//   buffer.copy(buf, 0, 0, 4096) x   357,373 ops/sec ±4.89% (54 runs sampled)
//
