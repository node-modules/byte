'use strict';

var bench = require('fastbench');
var ByteBuffer = require('..');

var largeStr = JSON.stringify(require('../package.json'))
largeStr += largeStr
largeStr += largeStr

var bb = ByteBuffer.allocate(1024);
var max = 10;

// putRawString

bb.putRawString(makeStr('a', 200));
console.log('putRawString: small < 0x80 bytes %s, one char length: %d',
  bb.array().length, 'a'.length);
bb.reset();

bb.putRawString(makeStr('ȅ', 200));
console.log('putRawString: small < 0x800 bytes %s, one char length: %d',
  bb.array().length, 'ȅ'.length);
bb.reset();

bb.putRawString(makeStr('𐐀', 200));
console.log('putRawString: small >= 0x800 bytes %s, one char length: %d, maxIncreaseSize: %d, bb.size: %d',
  bb.array().length, '𐐀'.length, makeStr('𐐀', 200).length * 3, bb._size);
bb.reset();

bb.putRawString(makeStr(String.fromCharCode(0x801), 200));
console.log('putRawString: small = 0x801 bytes %s, one char length: %d',
  bb.array().length, String.fromCharCode(0x801).length);
bb.reset();

bb.putRawString(makeStr('中文', 200));
console.log('putRawString: small 中文 bytes %s, one char length: %d, maxIncreaseSize: %d, bb.size: %d',
  bb.array().length, '中文'.length, makeStr('中文', 200).length * 3, bb._size);
bb.reset();

bb.putRawString(makeStr('\ud83c\udf3c', 200));
console.log('putRawString: small \ud83c\udf3c bytes %s, one char length: %d, maxIncreaseSize: %d, bb.size: %d',
  bb.array().length, '\ud83c\udf3c'.length, makeStr('\ud83c\udf3c', 200).length * 3, bb._size);
bb.reset();

bb.putRawString(makeStr(largeStr, 10));
console.log('putRawString: large bytes %s, one char length: %d',
  bb.array().length);
bb.reset();

// putUTF8RawString

bb = ByteBuffer.allocate(2);
bb.putUTF8RawString(makeStr('a', 200));
console.log('putUTF8RawString: small < 0x80 bytes %s, one char length: %d',
  bb.array().length, 'a'.length);
bb.reset();

bb.putUTF8RawString(makeStr('ȅ', 200));
console.log('putUTF8RawString: small < 0x800 bytes %s, one char length: %d',
  bb.array().length, 'ȅ'.length);
bb.reset();

bb.putUTF8RawString(makeStr('𐐀', 200));
console.log('putUTF8RawString: small >= 0x800 bytes %s, one char length: %d, byteLength: %d, bb.size: %d',
  bb.array().length, '𐐀'.length, Buffer.byteLength(makeStr('𐐀', 200)), bb._size);
bb.reset();

bb.putUTF8RawString(makeStr('中文', 200));
console.log('putUTF8RawString: small 中文 bytes %s, one char length: %d, byteLength: %d, bb.size: %d',
  bb.array().length, '中文'.length, Buffer.byteLength(makeStr('中文', 200)), bb._size);
bb.reset();

bb.putUTF8RawString(makeStr('\ud83c\udf3c', 200));
console.log('putUTF8RawString: small \ud83c\udf3c bytes %s, one char length: %d, byteLength: %d, bb.size: %d',
  bb.array().length, '\ud83c\udf3c'.length, Buffer.byteLength(makeStr('\ud83c\udf3c', 200)), bb._size);
bb.reset();

bb.putUTF8RawString(makeStr(String.fromCharCode(0x801), 200));
console.log('putUTF8RawString: small = 0x801 bytes %s, one char length: %d',
  bb.array().length, String.fromCharCode(0x801).length);
bb.reset();

bb.putUTF8RawString(makeStr(largeStr, 10));
console.log('putUTF8RawString: large bytes %s, one char length: %d',
  bb.array().length);
bb.reset();

bb = ByteBuffer.allocate(1024);

var run = bench([
  function putRawStringSmallLessThan0x80(cb) {
    for (var i = 0; i < max; i++) {
      bb.putRawString(makeStr('a', 200));
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },
  function putRawStringSmallLessThan0x800(cb) {
    for (var i = 0; i < max; i++) {
      bb.putRawString(makeStr('ȅ', 200));
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },
  function putRawStringSmallBiggerThan0x800(cb) {
    for (var i = 0; i < max; i++) {
      bb.putRawString(makeStr('𐐀', 200));
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },
  function putRawStringSmallChinese(cb) {
    for (var i = 0; i < max; i++) {
      bb.putRawString(makeStr('中文', 200));
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },
  function putRawStringSmallEmoji(cb) {
    for (var i = 0; i < max; i++) {
      bb.putRawString(makeStr('\ud83c\udf3c', 200));
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },

  function putUTF8RawStringSmallLessThan0x80(cb) {
    for (var i = 0; i < max; i++) {
      bb.putUTF8RawString(makeStr('a', 200));
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },
  function putUTF8RawStringSmallLessThan0x800(cb) {
    for (var i = 0; i < max; i++) {
      bb.putUTF8RawString(makeStr('ȅ', 200));
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },
  function putUTF8RawStringSmallBiggerThan0x800(cb) {
    for (var i = 0; i < max; i++) {
      bb.putUTF8RawString(makeStr('𐐀', 200));
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },
  function putUTF8RawStringSmallChinese(cb) {
    for (var i = 0; i < max; i++) {
      bb.putUTF8RawString(makeStr('中文', 200));
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },
  function putUTF8RawStringSmallEmoji(cb) {
    for (var i = 0; i < max; i++) {
      bb.putUTF8RawString(makeStr('\ud83c\udf3c', 200));
    }
    bb.array();
    bb.reset();
    setImmediate(cb);
  },
  // function putRawStringLarge(cb) {
  //   for (var i = 0; i < max; i++) {
  //     bb.putRawString(makeStr(largeStr, 10));
  //   }
  //   bb.array();
  //   bb.reset();
  //   setImmediate(cb);
  // },
], 10000);

run(run);

function makeStr(str, concats) {
  var s = ''
  while (concats--) {
    s += str
  }
  return s
}

// before:
// putRawStringSmall*10000: 912.743ms
// putRawStringSmall*10000: 869.517ms

// after:
// putRawStringSmall*10000: 502.805ms
// putRawStringSmall*10000: 489.996ms
