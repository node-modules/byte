/**!
 * byte - benchmark/static_method_name.js
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

var obj = {
  getValue: function () {
    var a = 0;
    for (var i = 0; i < 100; i++) {
      a += i;
    }
    return a;
  }
};

suite
.add('obj.method()', function () {
  obj.getValue();
})
.add('obj[method]()', function () {
  var method = 'getValue';
  obj[method]();
})
.add('obj[a + b]()', function () {
  var method = 'get';
  method += 'Value';
  obj[method]();
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

// node version: v0.11.12, date: Thu May 22 2014 21:34:45 GMT+0800 (CST)
// Starting...
// 3 tests completed.
//
// obj.method()  x 9,103,410 ops/sec ±0.64% (100 runs sampled)
// obj[method]() x 9,093,201 ops/sec ±0.96% (95 runs sampled)
// obj[a + b]()  x 4,383,463 ops/sec ±0.83% (98 runs sampled)
