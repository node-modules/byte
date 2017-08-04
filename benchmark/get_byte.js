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

console.log('new OldByteBuffer({ array: buf }).get(): %d', new OldByteBuffer({ array: buf }).get());
console.log('new ByteBuffer({ array: buf }).get(): %d', new ByteBuffer({ array: buf }).get());
console.log('new OldByteBuffer({ array: buf }).get(0): %d', new OldByteBuffer({ array: buf }).get(0));
console.log('new ByteBuffer({ array: buf }).get(0): %d', new ByteBuffer({ array: buf }).get(0));
console.log('new ByteBuffer({ array: buf }).getByte(): %d', new ByteBuffer({ array: buf }).getByte());
console.log('new ByteBuffer({ array: buf }).getByte(0): %d', new ByteBuffer({ array: buf }).getByte(0));

suite
  .add('old get()', function() {
    const bytes = new OldByteBuffer({ array: buf });
    bytes.get();
  })
  .add('new get()', function() {
    const bytes = new ByteBuffer({ array: buf });
    bytes.get();
  })
  .add('getByte()', function() {
    const bytes = new ByteBuffer({ array: buf });
    bytes.getByte();
  })
  .add('old get(index)', function() {
    const bytes = new OldByteBuffer({ array: buf });
    bytes.get(0);
  })
  .add('new get(index)', function() {
    const bytes = new ByteBuffer({ array: buf });
    bytes.get(0);
  })
  .add('getByte(index)', function() {
    const bytes = new ByteBuffer({ array: buf });
    bytes.getByte(0);
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

// node version: v8.2.1, date: Mon Aug 07 2017 15:38:34 GMT+0800 (CST)
//   Starting...
//   6 tests completed.
//
//   old get()      x  7,206,620 ops/sec ±8.81% (76 runs sampled)
//   new get()      x 13,628,654 ops/sec ±15.71% (72 runs sampled)
//   getByte()      x 18,050,339 ops/sec ±14.48% (76 runs sampled)
//   old get(index) x  6,989,958 ops/sec ±9.77% (75 runs sampled)
//   new get(index) x 13,580,238 ops/sec ±10.13% (72 runs sampled)
//   getByte(index) x 16,031,923 ops/sec ±14.93% (62 runs sampled)
