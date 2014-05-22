/**!
 * byte - benchmark/buffer_toString.js
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

suite
.add('buf.copy(0, 1024).toString()', function () {
  var b = new Buffer(1024);
  buffer.copy(b, 0, 0, 1024);
})
.add('buf.toString(0, 1024)', function () {
  var b = buffer.toString('utf8', 0, 1024);
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
