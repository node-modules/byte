'use strict';

var Benchmark = require('benchmark');
var benchmarks = require('beautify-benchmark');

var suite = new Benchmark.Suite();

var ByteBuffer = require('..');

var byte = ByteBuffer.wrap(new Buffer(512));

// prevent GC
var pool = [];
for (var i = 0; i < 500000; i++) {
  pool.push(new Buffer(512));
}

suite
  .add('pool and memcpy()', function () {
    var ret = [];
    for (var i = 0; i < 500000; i++) {
      var buf = pool.pop();
      byte.memcpy(buf);
      ret.push(buf);
    }

    // recycle
    for (var i = 0; i < 500000; i++) {
      pool.push(ret[i]);
    }
  })
  .add('array()', function () {
    var ret = [];
    for (var i = 0; i < 500000; i++) {
      ret.push(byte.array());
    }
  })
  .on('cycle', function(event) {
    benchmarks.add(event.target);
  })
  .on('complete', function done() {
    benchmarks.log();
  })
  .run({ 'async': true });
