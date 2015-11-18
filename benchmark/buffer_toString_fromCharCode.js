/**!
 * byte - benchmark/buffer_toString_fromCharCode.js
 *
 * Copyright(c) tangyao and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   tangyao <2001-wms@163.com>
 */

'use strict';

/**
 * Module dependencies.
 */

var Benchmark = require('benchmark');
var benchmarks = require('beautify-benchmark');

function getRawString(_bytes, index, length) {
  var data = [];
  for (var pos = index, end = index + length; pos < end; pos++) {
    var ch = _bytes[pos];
    if (ch < 0x80) {
      data.push(ch);
    } else if ((ch & 0xe0) === 0xc0) {
      var ch1 = _bytes[++pos];
      var v = ((ch & 0x1f) << 6) + (ch1 & 0x3f);
      data.push(v);
    } else if ((ch & 0xf0) === 0xe0) {
      var ch1 = _bytes[++pos];
      var ch2 = _bytes[++pos];
      var v = ((ch & 0x0f) << 12) + ((ch1 & 0x3f) << 6) + (ch2 & 0x3f);
      data.push(v);
    }
  }
  return String.fromCharCode.apply(null, data);
}

var suite = new Benchmark.Suite();

var buffer = new Buffer('eda0bdedb880577777e982a3', 'hex');

suite
.add('buffer.toString', function () {
  buffer.toString('utf8', 0, 12);
})
.add('getRawString', function () {
  getRawString(buffer, 0, 12);
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
