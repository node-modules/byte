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

// see https://github.com/joyent/node/issues/7633, there's a bug in Buffer.slice
// slice `must` faster using copy

// node version: v0.10.28, date: Thu Jul 24 2014 17:11:50 GMT+0800 (CST)
//   Starting...
//   20 tests completed.

//   buffer.slice(0, 100)            x 4,133,470 ops/sec ±0.52% (98 runs sampled)
//   buffer.slice(0, 512)            x 4,076,001 ops/sec ±0.70% (95 runs sampled)
//   buffer.slice(0, 1024)           x 4,075,137 ops/sec ±0.74% (96 runs sampled)
//   buffer.slice(0, 2048)           x 4,082,689 ops/sec ±0.80% (98 runs sampled)
//   buffer.slice(0, 3072)           x 4,078,376 ops/sec ±0.82% (99 runs sampled)
//   buffer.slice(0, 4096)           x 4,057,763 ops/sec ±0.83% (98 runs sampled)
//   buffer.slice(0, 10240)          x 4,050,725 ops/sec ±0.70% (98 runs sampled)
//   buffer.slice(0, 20480)          x 4,070,244 ops/sec ±0.63% (97 runs sampled)
//   buffer.slice(0, 102400)         x 4,070,703 ops/sec ±0.72% (98 runs sampled)
//   buffer.slice(0, 1024000)        x 4,013,651 ops/sec ±1.92% (94 runs sampled)
//   buffer.copy(buf, 0, 0, 100)     x 2,269,384 ops/sec ±2.37% (84 runs sampled)
//   buffer.copy(buf, 0, 0, 512)     x 1,617,398 ops/sec ±4.68% (79 runs sampled)
//   buffer.copy(buf, 0, 0, 1024)    x 1,159,822 ops/sec ±6.90% (72 runs sampled)
//   buffer.copy(buf, 0, 0, 2048)    x   687,002 ops/sec ±9.26% (68 runs sampled)
//   buffer.copy(buf, 0, 0, 3072)    x   411,795 ops/sec ±8.50% (64 runs sampled)
//   buffer.copy(buf, 0, 0, 4096)    x   382,673 ops/sec ±8.54% (64 runs sampled)
//   buffer.copy(buf, 0, 0, 10240)   x   177,636 ops/sec ±7.88% (64 runs sampled)
//   buffer.copy(buf, 0, 0, 20480)   x   105,564 ops/sec ±5.76% (63 runs sampled)
//   buffer.copy(buf, 0, 0, 102400)  x    23,847 ops/sec ±5.31% (63 runs sampled)
//   buffer.copy(buf, 0, 0, 1024000) x     1,378 ops/sec ±6.64% (69 runs sampled)

//  node version: v0.11.12, date: Thu Jul 24 2014 17:09:46 GMT+0800 (CST)
//   Starting...
//   20 tests completed.

//   buffer.slice(0, 100)            x   525,025 ops/sec ±0.95% (89 runs sampled)
//   buffer.slice(0, 512)            x   519,218 ops/sec ±0.86% (88 runs sampled)
//   buffer.slice(0, 1024)           x   508,021 ops/sec ±1.20% (87 runs sampled)
//   buffer.slice(0, 2048)           x   506,564 ops/sec ±0.99% (91 runs sampled)
//   buffer.slice(0, 3072)           x   500,106 ops/sec ±1.34% (87 runs sampled)
//   buffer.slice(0, 4096)           x   496,506 ops/sec ±0.82% (93 runs sampled)
//   buffer.slice(0, 10240)          x   490,872 ops/sec ±1.12% (80 runs sampled)
//   buffer.slice(0, 20480)          x   475,820 ops/sec ±1.52% (92 runs sampled)
//   buffer.slice(0, 102400)         x   473,705 ops/sec ±2.12% (88 runs sampled)
//   buffer.slice(0, 1024000)        x   476,851 ops/sec ±2.27% (79 runs sampled)
//   buffer.copy(buf, 0, 0, 100)     x 2,583,864 ops/sec ±2.88% (85 runs sampled)
//   buffer.copy(buf, 0, 0, 512)     x 1,751,573 ops/sec ±5.28% (71 runs sampled)
//   buffer.copy(buf, 0, 0, 1024)    x 1,184,664 ops/sec ±3.42% (64 runs sampled)
//   buffer.copy(buf, 0, 0, 2048)    x   734,049 ops/sec ±2.82% (54 runs sampled)
//   buffer.copy(buf, 0, 0, 3072)    x   403,018 ops/sec ±3.51% (52 runs sampled)
//   buffer.copy(buf, 0, 0, 4096)    x   405,895 ops/sec ±2.47% (54 runs sampled)
//   buffer.copy(buf, 0, 0, 10240)   x   237,699 ops/sec ±3.93% (69 runs sampled)
//   buffer.copy(buf, 0, 0, 20480)   x   118,614 ops/sec ±2.73% (63 runs sampled)
//   buffer.copy(buf, 0, 0, 102400)  x    26,788 ops/sec ±2.90% (67 runs sampled)
//   buffer.copy(buf, 0, 0, 1024000) x     1,554 ops/sec ±7.74% (76 runs sampled)


//   node version: v0.11.13, date: Thu Jul 24 2014 17:14:57 GMT+0800 (CST)
//   Starting...
//   20 tests completed.

//   buffer.slice(0, 100)            x 351,290 ops/sec ±0.88% (91 runs sampled)
//   buffer.slice(0, 512)            x 348,360 ops/sec ±1.71% (91 runs sampled)
//   buffer.slice(0, 1024)           x 314,430 ops/sec ±2.78% (84 runs sampled)
//   buffer.slice(0, 2048)           x 330,248 ops/sec ±1.55% (90 runs sampled)
//   buffer.slice(0, 3072)           x 342,144 ops/sec ±1.39% (90 runs sampled)
//   buffer.slice(0, 4096)           x 335,501 ops/sec ±2.09% (88 runs sampled)
//   buffer.slice(0, 10240)          x 323,797 ops/sec ±2.98% (87 runs sampled)
//   buffer.slice(0, 20480)          x 336,563 ops/sec ±2.54% (89 runs sampled)
//   buffer.slice(0, 102400)         x 339,645 ops/sec ±2.02% (88 runs sampled)
//   buffer.slice(0, 1024000)        x 352,851 ops/sec ±0.85% (90 runs sampled)
//   buffer.copy(buf, 0, 0, 100)     x 462,087 ops/sec ±1.59% (86 runs sampled)
//   buffer.copy(buf, 0, 0, 512)     x 404,869 ops/sec ±2.64% (82 runs sampled)
//   buffer.copy(buf, 0, 0, 1024)    x 364,389 ops/sec ±1.54% (75 runs sampled)
//   buffer.copy(buf, 0, 0, 2048)    x 295,099 ops/sec ±3.07% (78 runs sampled)
//   buffer.copy(buf, 0, 0, 3072)    x 228,912 ops/sec ±2.96% (77 runs sampled)
//   buffer.copy(buf, 0, 0, 4096)    x 229,552 ops/sec ±1.45% (76 runs sampled)
//   buffer.copy(buf, 0, 0, 10240)   x 201,062 ops/sec ±4.27% (67 runs sampled)
//   buffer.copy(buf, 0, 0, 20480)   x 124,037 ops/sec ±1.91% (72 runs sampled)
//   buffer.copy(buf, 0, 0, 102400)  x  26,407 ops/sec ±1.47% (70 runs sampled)
//   buffer.copy(buf, 0, 0, 1024000) x   1,565 ops/sec ±5.57% (75 runs sampled)

