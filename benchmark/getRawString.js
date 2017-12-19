'use strict';

const Benchmark = require('benchmark');
const benchmarks = require('beautify-benchmark');
const assert = require('assert');

const ByteBuffer = require('..');
const io = ByteBuffer.allocate(1024 * 1024);

const str = '1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234';
// const str = 'com.alipay.sofa.service.hsf.service.SofaHSFRequest';
// const str = '123456789012345678901';
// const str = '12345678901234567890123456789012345678901234567890';
io.putRawString(str);
const buf = io.array();
const len = buf.length;

// io.position(0);
// console.log(io.getRawStringByStringLength(1024));
// console.log(buf.toString());

// io.position(0);
// assert(io.getRawStringByStringLength(1024) === buf.toString());

function getUTF(buf) {
  const data = [];
  const length = buf.length;
  for (let i = 0; i < length; i++) {
    const ch = buf[i];
    if (ch < 0x80) {
      data.push(ch);
    } else if ((ch & 0xe0) === 0xc0) {
      const ch1 = buf[++i];
      const v = ((ch & 0x1f) << 6) + (ch1 & 0x3f);
      data.push(v);
    } else if ((ch & 0xf0) === 0xe0) {
      const ch1 = buf[++i];
      const ch2 = buf[++i];
      const v = ((ch & 0x0f) << 12) + ((ch1 & 0x3f) << 6) + (ch2 & 0x3f);
      data.push(v);
    } else {
      throw new Error('string is not valid UTF-8 encode');
    }
  }
  return String.fromCharCode.apply(String, data);
}

// assert(getUTF(buf) === buf.toString());


function getUTF2(buf) {
  const length = buf.length;
  const data = [];
  let start = 0;
  const numInts = length >> 2;
  for (let i = 0; i < numInts; i++) {
    const num = buf.readInt32BE(i * 4);
    if ((num & 0x80808080) !== 0) {
      throw new Error();
    }
  }
  const offset = start + length;
  return buf.toString('utf8', 0, offset);
}

// assert(getUTF2(buf) === buf.toString());
// io.position(0);
// assert(io.getRawStringFast(1024) === buf.toString());

// io.position(0);
// assert(io.getUTFString(1024) === buf.toString());

io._offset = 0;
console.log(io.getRawStringByStringLength(len));
io._offset = 0;
console.log(io.getRawStringFast(len));
io._offset = 0;
console.log(io.getUTFString(len));

const suite = new Benchmark.Suite();
suite
  .add('io.getRawStringByStringLength', function() {
    io._offset = 0;
    io.getRawStringByStringLength(len);
  })
  .add('io.getRawStringFast', function() {
    io._offset = 0;
    io.getRawStringFast(len);
  })
  .add('io.getUTFString', function() {
    io._offset = 0;
    io.getUTFString(len);
  })
  .add('buf.toString', function() {
    buf.toString();
  })
  .add('getUTF', function() {
    getUTF(buf);
  })
  .add('getUTF2', function() {
    getUTF2(buf);
  })
  .on('cycle', function(event) {
    benchmarks.add(event.target);
  })
  .on('start', function(event) {
    console.log('\n  Cache Benchmark\n  node version: %s, date: %s\n  Starting...',
      process.version, Date());
  })
  .on('complete', function done() {
    benchmarks.log();
  })
  .run({ 'async': false });

// Cache Benchmark
// node version: v8.9.1, date: Tue Dec 19 2017 14:45:26 GMT+0800 (CST)
// Starting...
// 5 tests completed.

// io.getRawStringByStringLength x   110,459 ops/sec ±1.40% (88 runs sampled)
// io.getRawStringFast           x   709,949 ops/sec ±1.08% (90 runs sampled)
// buf.toString                  x 3,961,437 ops/sec ±0.99% (90 runs sampled)
// getUTF                        x   125,213 ops/sec ±1.63% (92 runs sampled)
// getUTF2                       x   950,905 ops/sec ±1.20% (94 runs sampled)
