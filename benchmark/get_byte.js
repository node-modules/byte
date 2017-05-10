'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const ByteBuffer = require('../');

class OldByteBuffer extends ByteBuffer {
  get(index, length) {
    if (index instanceof Buffer || Array.isArray(index)) { // get (byte[] dst, int offset, int length)
      var dst = index;
      var offset = length || 0;
      length = dst.length;

      this.checkArraySize(dst.length, offset, length);
      this.checkForUnderflow(length);

      if (dst instanceof Buffer) {
        this._bytes.copy(dst, offset, this._offset, (this._offset + length));
      } else {
        for (var i = offset; i < (offset + length); i++) {
          dst[i] = this._bytes[i];
        }
      }
      this._offset += length;
      return this;
    } else if (typeof index !== 'number') {
      index = this._offset++;
    } else if (typeof length === 'number') {
      // offset, length => Buffer
      return this._copy(index, index + length);
    }
    // return byte
    return this._bytes[index];
  }
}

const suite = new Benchmark.Suite();

const buf = new Buffer([2, 1, 255, 255, 255, 254, 1]);

suite
  .add('old get()', function() {
    const bytes = new OldByteBuffer({ array: buf });
    bytes.get();
  })
  .add('new get()', function() {
    const bytes = new ByteBuffer({ array: buf });
    bytes.get();
  })
  .add('old get(index)', function() {
    const bytes = new OldByteBuffer({ array: buf });
    bytes.get(0);
  })
  .add('new get(index)', function() {
    const bytes = new ByteBuffer({ array: buf });
    bytes.get(0);
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

// node version: v7.10.0, date: Thu May 11 2017 02:58:46 GMT+0800 (CST)
// Starting...
// 4 tests completed.

// old get()      x  2,234,273 ops/sec ±1.45% (90 runs sampled)
// new get()      x 24,872,342 ops/sec ±2.13% (89 runs sampled)
// old get(index) x  2,339,452 ops/sec ±0.81% (93 runs sampled)
// new get(index) x 25,533,534 ops/sec ±0.84% (100 runs sampled)
