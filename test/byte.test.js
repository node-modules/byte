/*!
 * byte - test/byte.test.js
 *
 * Copyright(c) 2013 - 2014
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 *   dead-horse <dead_horse@qq.com> (https://github.com/dead-horse)
 */

"use strict";

/**
 * Module dependencies.
 */

var should = require('should');
var Long = require('long');
var ByteBuffer = require('../');

describe('byte.test.js', function () {
  describe('new ByteBuffer()', function () {
    it('should create ByteBuffer', function () {
      var bytes = new ByteBuffer();
      bytes.array().should.length(0);
      bytes.position().should.equal(0);
    });
  });

  describe('putString(), getString()', function () {
    it('should put empty string', function () {
      var bytes = new ByteBuffer({size: 1});
      bytes.putString('');
      bytes.putString('');
      bytes.putString(null);
      bytes.putString(new Buffer(''));
      bytes.putString(0, '');

      bytes.position(0);
      bytes.getString().should.equal('');
      bytes.getString().should.equal('');
      bytes.getString().should.equal('');
      bytes.getString().should.equal('');
    });

    it('should put strings', function () {
      var bytes = new ByteBuffer({size: 10});
      bytes.putString('foo, 中文');
      bytes.getString(0).should.equal('foo, 中文');
      bytes.putString(0, 'foo, 中国');
      bytes.getString(0).should.equal('foo, 中国');
      bytes.putString(0, new Buffer('foo, 中国'));
      bytes.getString(0).should.equal('foo, 中国');
      bytes.putString('foo2');
      bytes.getString(new Buffer('foo, 中国').length + 4).should.equal('foo2');

      bytes.position(0);
      bytes.getString().should.equal('foo, 中国');

      bytes = new ByteBuffer({size: 10});
      bytes.putCString('foo, \u0000中文\u0000');
      bytes.getCString(0).should.equal('foo, \u0000中文\u0000');
      bytes.putCString(0, 'bar123123, \u0000中文\u0000');
      bytes.getCString(0).should.equal('bar123123, \u0000中文\u0000');

      bytes.position(0);
      bytes.putCString('bar123123, \u0000中文\u0000');
      bytes.putCString('foo2foo, \u0000中文\u0000');
      bytes.getCString(new Buffer('bar123123, \u0000中文\u0000').length + 4 + 1).should.equal('foo2foo, \u0000中文\u0000');

      bytes.position(0);
      bytes.getCString().should.equal('bar123123, \u0000中文\u0000');
    });
  });

  describe('putChar(), getChar()', function () {
    it('should put a char', function () {
      var bytes = ByteBuffer.allocate(2);
      bytes.putChar('a');
      bytes.toString().should.equal('<ByteBuffer 61>');
      bytes.putChar('A');
      bytes.toString().should.equal('<ByteBuffer 61 41>');
      bytes.putChar('b');
      bytes.toString().should.equal('<ByteBuffer 61 41 62>');
      bytes.putChar(2, 'a');
      bytes.toString().should.equal('<ByteBuffer 61 41 61>');
      bytes.putChar('a');
      bytes.toString().should.equal('<ByteBuffer 61 41 61 61>');
      bytes.putChar('a');
      bytes.toString().should.equal('<ByteBuffer 61 41 61 61 61>');
      bytes.putChar('a');
      bytes.toString().should.equal('<ByteBuffer 61 41 61 61 61 61>');

      bytes.position(0);
      bytes.getChar().should.equal('a');
      bytes.getChar().should.equal('A');
      bytes.getChar().should.equal('a');
      bytes.getChar().should.equal('a');
      bytes.getChar().should.equal('a');
      bytes.getChar().should.equal('a');
      bytes.getChar(1).should.equal('A');
      bytes.position().should.equal(6);
    });
  });

  describe('putFloat(), getFloat()', function () {
    it('should put a float', function () {
      var cases = [
        // value, big, litter
        [-91.99999, '<ByteBuffer c2 b7 ff ff>', '<ByteBuffer ff ff b7 c2>'],
        [-100, '<ByteBuffer c2 c8 00 00>', '<ByteBuffer 00 00 c8 c2>'],
        [-1, '<ByteBuffer bf 80 00 00>', '<ByteBuffer 00 00 80 bf>'],
        [0, '<ByteBuffer 00 00 00 00>', '<ByteBuffer 00 00 00 00>'],
        [1, '<ByteBuffer 3f 80 00 00>', '<ByteBuffer 00 00 80 3f>'],
        [2, '<ByteBuffer 40 00 00 00>', '<ByteBuffer 00 00 00 40>'],
        [100, '<ByteBuffer 42 c8 00 00>', '<ByteBuffer 00 00 c8 42>'],
        [999, '<ByteBuffer 44 79 c0 00>', '<ByteBuffer 00 c0 79 44>'],
        [99.999, '<ByteBuffer 42 c7 ff 7d>', '<ByteBuffer 7d ff c7 42>'],
        [1024, '<ByteBuffer 44 80 00 00>', '<ByteBuffer 00 00 80 44>'],
        [123123.125, '<ByteBuffer 47 f0 79 90>', '<ByteBuffer 90 79 f0 47>'],
      ];
      var bytes = ByteBuffer.allocate(4);
      bytes.putFloat(0);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00>');
      bytes.position(0);
      bytes.getFloat().should.equal(0);
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putFloat(0, item[0]);
        bytes.toString().should.equal(item[1]);
        String(bytes.getFloat(0)).should.include(item[0]);

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putFloat(0, item[0]);
        bytes.toString().should.equal(item[2]);
        String(bytes.getFloat(0)).should.include(item[0]);
      });
    });
  });

  describe('putInt(), getInt()', function () {
    it('should put an int', function () {
      var cases = [
        // value, big, litter
        [-91, '<ByteBuffer ff ff ff a5>', '<ByteBuffer a5 ff ff ff>'],
        [-100, '<ByteBuffer ff ff ff 9c>', '<ByteBuffer 9c ff ff ff>'],
        [-1, '<ByteBuffer ff ff ff ff>', '<ByteBuffer ff ff ff ff>'],
        [0, '<ByteBuffer 00 00 00 00>', '<ByteBuffer 00 00 00 00>'],
        [1, '<ByteBuffer 00 00 00 01>', '<ByteBuffer 01 00 00 00>'],
        [2, '<ByteBuffer 00 00 00 02>', '<ByteBuffer 02 00 00 00>'],
        [100, '<ByteBuffer 00 00 00 64>', '<ByteBuffer 64 00 00 00>'],
        [999, '<ByteBuffer 00 00 03 e7>', '<ByteBuffer e7 03 00 00>'],
        [99999, '<ByteBuffer 00 01 86 9f>', '<ByteBuffer 9f 86 01 00>'],
        [1024, '<ByteBuffer 00 00 04 00>', '<ByteBuffer 00 04 00 00>'],
        [-2147483648, '<ByteBuffer 80 00 00 00>', '<ByteBuffer 00 00 00 80>'],
        [-2147483647, '<ByteBuffer 80 00 00 01>', '<ByteBuffer 01 00 00 80>'],
        // Math.pow(2, 31) - 1
        [2147483647, '<ByteBuffer 7f ff ff ff>', '<ByteBuffer ff ff ff 7f>'],
        [2147483646, '<ByteBuffer 7f ff ff fe>', '<ByteBuffer fe ff ff 7f>'],
      ];
      var bytes = ByteBuffer.allocate(1);
      bytes.putInt(0);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00>');
      bytes.position(0);
      bytes.getInt().should.equal(0);
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putInt(0, item[0]);
        bytes.toString().should.equal(item[1]);
        bytes.getInt(0).should.equal(item[0]);

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putInt(0, item[0]);
        bytes.toString().should.equal(item[2]);
        bytes.getInt(0).should.equal(item[0]);
      });
    });
  });

  describe('putInt8(), getInt8(), putUInt8(), getUInt8()', function () {
    it('should put and get 8 bits int', function () {
      var bytes = ByteBuffer.allocate(1);
      bytes.putInt8(-128);
      bytes.toString().should.equal('<ByteBuffer 80>');
      bytes.putInt8(0, -128);
      bytes.toString().should.equal('<ByteBuffer 80>');
      bytes.position(0);
      bytes.getInt8().should.equal(-128);
      bytes.putInt8(0, 0);
      bytes.toString().should.equal('<ByteBuffer 00>');
      bytes.getInt8(0).should.equal(0);

      bytes.putInt8(0, -128);
      bytes.toString().should.equal('<ByteBuffer 80>');

      bytes.putInt8(0, 127);
      bytes.toString().should.equal('<ByteBuffer 7f>');

      bytes.position(0);
      bytes.putUInt8(255);
      bytes.toString().should.equal('<ByteBuffer ff>');
      bytes.position(0);
      bytes.getUInt8().should.equal(255);

      bytes.putUInt8(0, 0).toString().should.equal('<ByteBuffer 00>');
      bytes.putUInt8(0, 0).getUInt8(0).should.equal(0);
    });
  });

  describe('putUInt(), getUInt()', function () {
    it('should put an int', function () {
      var cases = [
        // value, big, litter
        [0, '<ByteBuffer 00 00 00 00>', '<ByteBuffer 00 00 00 00>'],
        [1, '<ByteBuffer 00 00 00 01>', '<ByteBuffer 01 00 00 00>'],
        [2, '<ByteBuffer 00 00 00 02>', '<ByteBuffer 02 00 00 00>'],
        [100, '<ByteBuffer 00 00 00 64>', '<ByteBuffer 64 00 00 00>'],
        [999, '<ByteBuffer 00 00 03 e7>', '<ByteBuffer e7 03 00 00>'],
        [99999, '<ByteBuffer 00 01 86 9f>', '<ByteBuffer 9f 86 01 00>'],
        [1024, '<ByteBuffer 00 00 04 00>', '<ByteBuffer 00 04 00 00>'],
        // Math.pow(2, 31) - 1
        [2147483647, '<ByteBuffer 7f ff ff ff>', '<ByteBuffer ff ff ff 7f>'],
        [2147483646, '<ByteBuffer 7f ff ff fe>', '<ByteBuffer fe ff ff 7f>'],
        [2147483648, '<ByteBuffer 80 00 00 00>', '<ByteBuffer 00 00 00 80>'],
        [3249209323, '<ByteBuffer c1 aa ff eb>', '<ByteBuffer eb ff aa c1>'],
        // Math.pow(2, 32 - 2)
        [4294967294, '<ByteBuffer ff ff ff fe>', '<ByteBuffer fe ff ff ff>'],
        // Math.pow(2, 32 - 1)
        [4294967295, '<ByteBuffer ff ff ff ff>', '<ByteBuffer ff ff ff ff>'],
      ];
      var bytes = ByteBuffer.allocate(1);
      bytes.putUInt(0);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00>');
      bytes.position(0);
      bytes.getUInt().should.equal(0);
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putUInt(0, item[0]);
        bytes.toString().should.equal(item[1]);
        bytes.getUInt(0).should.equal(item[0]);

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putUInt(0, item[0]);
        bytes.toString().should.equal(item[2]);
        bytes.getUInt(0).should.equal(item[0]);
      });
    });
  });

  describe('putShort(), getShort()', function () {
    it('should put a short', function () {
      var cases = [
        // value, big, litter
        [-91, '<ByteBuffer ff a5>', '<ByteBuffer a5 ff>'],
        [-100, '<ByteBuffer ff 9c>', '<ByteBuffer 9c ff>'],
        [-1, '<ByteBuffer ff ff>', '<ByteBuffer ff ff>'],
        [0, '<ByteBuffer 00 00>', '<ByteBuffer 00 00>'],
        [1, '<ByteBuffer 00 01>', '<ByteBuffer 01 00>'],
        [2, '<ByteBuffer 00 02>', '<ByteBuffer 02 00>'],
        [100, '<ByteBuffer 00 64>', '<ByteBuffer 64 00>'],
        [999, '<ByteBuffer 03 e7>', '<ByteBuffer e7 03>'],
        [9999, '<ByteBuffer 27 0f>', '<ByteBuffer 0f 27>'],
        [1024, '<ByteBuffer 04 00>', '<ByteBuffer 00 04>'],
        [-32768, '<ByteBuffer 80 00>', '<ByteBuffer 00 80>'],
        [-32767, '<ByteBuffer 80 01>', '<ByteBuffer 01 80>'],
        // Math.pow(2, 15) - 1
        [32767, '<ByteBuffer 7f ff>', '<ByteBuffer ff 7f>'],
        [32766, '<ByteBuffer 7f fe>', '<ByteBuffer fe 7f>'],
      ];
      var bytes = ByteBuffer.allocate(1);
      bytes.putShort(0);
      bytes.toString().should.equal('<ByteBuffer 00 00>');
      bytes.position(0);
      bytes.getShort().should.equal(0);

      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putShort(0, item[0]);
        bytes.toString().should.equal(item[1]);
        bytes.getShort(0).should.equal(item[0]);

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putShort(0, item[0]);
        bytes.toString().should.equal(item[2]);
        bytes.getShort(0).should.equal(item[0]);
      });
    });
  });

  describe('putUInt16(), getUInt16()', function () {
    it('should put a uint16', function () {
      var cases = [
        // value, big, litter
        [0, '<ByteBuffer 00 00>', '<ByteBuffer 00 00>'],
        [1, '<ByteBuffer 00 01>', '<ByteBuffer 01 00>'],
        [2, '<ByteBuffer 00 02>', '<ByteBuffer 02 00>'],
        [100, '<ByteBuffer 00 64>', '<ByteBuffer 64 00>'],
        [999, '<ByteBuffer 03 e7>', '<ByteBuffer e7 03>'],
        [9999, '<ByteBuffer 27 0f>', '<ByteBuffer 0f 27>'],
        [1024, '<ByteBuffer 04 00>', '<ByteBuffer 00 04>'],
        // Math.pow(2, 15) - 1
        [32768, '<ByteBuffer 80 00>', '<ByteBuffer 00 80>'],
        [40000, '<ByteBuffer 9c 40>', '<ByteBuffer 40 9c>'],

        // Math.pow(2, 16) - 1
        [65534, '<ByteBuffer ff fe>', '<ByteBuffer fe ff>'],
        [65535, '<ByteBuffer ff ff>', '<ByteBuffer ff ff>'],
      ];
      var bytes = ByteBuffer.allocate(1);
      bytes.putUInt16(0);
      bytes.toString().should.equal('<ByteBuffer 00 00>');
      bytes.position(0);
      bytes.getUInt16().should.equal(0);

      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putUInt16(0, item[0]);
        bytes.toString().should.equal(item[1]);
        bytes.getUInt16(0).should.equal(item[0]);

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putUInt16(0, item[0]);
        bytes.toString().should.equal(item[2]);
        bytes.getUInt16(0).should.equal(item[0]);
      });
    });
  });

  describe('putLong(), getLong()', function () {
    it('should put a long', function () {
      var cases = [
        // value, big, litter
        [-91, '<ByteBuffer ff ff ff ff ff ff ff a5>', '<ByteBuffer a5 ff ff ff ff ff ff ff>'],
        [-100, '<ByteBuffer ff ff ff ff ff ff ff 9c>', '<ByteBuffer 9c ff ff ff ff ff ff ff>'],
        [-1, '<ByteBuffer ff ff ff ff ff ff ff ff>', '<ByteBuffer ff ff ff ff ff ff ff ff>'],
        [0, '<ByteBuffer 00 00 00 00 00 00 00 00>', '<ByteBuffer 00 00 00 00 00 00 00 00>'],
        [1, '<ByteBuffer 00 00 00 00 00 00 00 01>', '<ByteBuffer 01 00 00 00 00 00 00 00>'],
        [2, '<ByteBuffer 00 00 00 00 00 00 00 02>', '<ByteBuffer 02 00 00 00 00 00 00 00>'],
        [100, '<ByteBuffer 00 00 00 00 00 00 00 64>', '<ByteBuffer 64 00 00 00 00 00 00 00>'],
        [999, '<ByteBuffer 00 00 00 00 00 00 03 e7>', '<ByteBuffer e7 03 00 00 00 00 00 00>'],
        [99999, '<ByteBuffer 00 00 00 00 00 01 86 9f>', '<ByteBuffer 9f 86 01 00 00 00 00 00>'],
        [1024, '<ByteBuffer 00 00 00 00 00 00 04 00>', '<ByteBuffer 00 04 00 00 00 00 00 00>'],
        [-2147483648, '<ByteBuffer ff ff ff ff 80 00 00 00>', '<ByteBuffer 00 00 00 80 ff ff ff ff>'],
        [-2147483647, '<ByteBuffer ff ff ff ff 80 00 00 01>', '<ByteBuffer 01 00 00 80 ff ff ff ff>'],
        // Math.pow(2, 31) - 1
        [2147483647, '<ByteBuffer 00 00 00 00 7f ff ff ff>', '<ByteBuffer ff ff ff 7f 00 00 00 00>'],
        [2147483646, '<ByteBuffer 00 00 00 00 7f ff ff fe>', '<ByteBuffer fe ff ff 7f 00 00 00 00>'],
        // Math.pow(2, 31)
        [2147483648, '<ByteBuffer 00 00 00 00 80 00 00 00>', '<ByteBuffer 00 00 00 80 00 00 00 00>'],
        ['99999', '<ByteBuffer 00 00 00 00 00 01 86 9f>', '<ByteBuffer 9f 86 01 00 00 00 00 00>'],
        ['2147483648', '<ByteBuffer 00 00 00 00 80 00 00 00>', '<ByteBuffer 00 00 00 80 00 00 00 00>'],
        ['-2147483647', '<ByteBuffer ff ff ff ff 80 00 00 01>', '<ByteBuffer 01 00 00 80 ff ff ff ff>'],
        // 2, 63 - 1
        ['-9223372036854775808', '<ByteBuffer 80 00 00 00 00 00 00 00>', '<ByteBuffer 00 00 00 00 00 00 00 80>'],
        ['-9223372036854775807', '<ByteBuffer 80 00 00 00 00 00 00 01>', '<ByteBuffer 01 00 00 00 00 00 00 80>'],
        ['9223372036854775807', '<ByteBuffer 7f ff ff ff ff ff ff ff>', '<ByteBuffer ff ff ff ff ff ff ff 7f>'],
        ['9223372036854775806', '<ByteBuffer 7f ff ff ff ff ff ff fe>', '<ByteBuffer fe ff ff ff ff ff ff 7f>'],

        [Long.fromString('9223372036854775806'),
          '<ByteBuffer 7f ff ff ff ff ff ff fe>', '<ByteBuffer fe ff ff ff ff ff ff 7f>'],
      ];
      var bytes = ByteBuffer.allocate(1);
      bytes.putLong(0);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00 00 00 00 00>');
      bytes.position(0);
      bytes.getLong().toString().should.equal('0');
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putLong(0, item[0]);
        bytes.toString().should.equal(item[1]);
        bytes.getLong(0).toString().should.equal(String(item[0]));

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putLong(0, item[0]);
        bytes.toString().should.equal(item[2]);
        bytes.getLong(0).toString().should.equal(String(item[0]));
      });
    });
  });

  describe('putDouble(), getDouble()', function () {
    it('should put a double', function () {
      var bytes = ByteBuffer.allocate(2);
      bytes.putDouble(1);
      bytes.toString().should.equal('<ByteBuffer 3f f0 00 00 00 00 00 00>');
      bytes.position(0);
      bytes.getDouble().should.equal(1);

      bytes.putDouble(0, 0);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00 00 00 00 00>');
      bytes.getDouble(0).should.equal(0);

      bytes.putDouble(0, 2);
      bytes.toString().should.equal('<ByteBuffer 40 00 00 00 00 00 00 00>');
      bytes.getDouble(0).should.equal(2);

      bytes.putDouble(0, 1024);
      bytes.toString().should.equal('<ByteBuffer 40 90 00 00 00 00 00 00>');
      bytes.getDouble(0).should.equal(1024);

      bytes.order(ByteBuffer.LITTLE_ENDIAN);
      bytes.putDouble(0, 1);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00 00 00 f0 3f>');
      bytes.getDouble(0).should.equal(1);

      bytes.putDouble(0, 1024);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00 00 00 90 40>');
      bytes.getDouble(0).should.equal(1024);

      bytes.order(ByteBuffer.BIG_ENDIAN);
      bytes.putDouble(0, 1123123.123123);
      bytes.toString().should.equal('<ByteBuffer 41 31 23 33 1f 84 fd 2a>');
      bytes.getDouble(0).should.equal(1123123.123123);

      bytes.order(ByteBuffer.LITTLE_ENDIAN);
      bytes.putDouble(0, 1123123.123123);
      bytes.toString().should.equal('<ByteBuffer 2a fd 84 1f 33 23 31 41>');
      bytes.getDouble(0).should.equal(1123123.123123);

      bytes.order(ByteBuffer.BIG_ENDIAN);
      bytes.putDouble(1123123.123123);
      bytes.toString().should.equal('<ByteBuffer 2a fd 84 1f 33 23 31 41 41 31 23 33 1f 84 fd 2a>');
      bytes.getDouble(8).should.equal(1123123.123123);

      ByteBuffer.wrap(bytes.array()).getDouble(8).should.equal(1123123.123123);
      ByteBuffer.wrap(bytes.array(), 8, 8).getDouble(0).should.equal(1123123.123123);
    });
  });

  describe('put()', function () {
    it('should put byte', function () {
      var bytes = ByteBuffer.allocate(1);
      bytes.put(1);
      bytes.toString().should.equal('<ByteBuffer 01>');
      bytes.get(0).should.equal(1);

      bytes.put(0, 2);
      bytes.toString().should.equal('<ByteBuffer 02>');
      bytes.get(0).should.equal(2);

      bytes.put(1);
      bytes.toString().should.equal('<ByteBuffer 02 01>');
      bytes.get(1).should.equal(1);
    });
  });

  describe('putBuffer()', function () {
    it('should put Buffer ok', function () {
      var bytes = ByteBuffer.allocate(1);
      bytes.putBuffer(new Buffer([1]));
      bytes.toString().should.equal('<ByteBuffer 01>');
      bytes.get(0).should.equal(1);

      bytes.putBuffer(0, new Buffer([1, 2, 3]), 1, 1);
      bytes.toString().should.equal('<ByteBuffer 02>');
      bytes.get(0).should.equal(2);

      bytes.putBuffer(new Buffer([3, 4]));
      bytes.toString().should.equal('<ByteBuffer 02 03 04>');
    });
  })

  describe('putRawString()', function () {
    it('should put raw string', function () {
      var bytes = ByteBuffer.allocate(1);
      bytes.putRawString('hello');
      bytes.putRawString(' world');
      bytes.toString().should.equal('<ByteBuffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>');
      bytes.getRawString(0, 11).should.equal('hello world');
      bytes.position(0);
      bytes.getRawString().should.equal('h');

      bytes = ByteBuffer.allocate(1);
      bytes.putRawString('你好');
      bytes.toString().should.equal('<ByteBuffer e4 bd a0 e5 a5 bd>');
      bytes.position(0).readRawString(6).should.equal('你好');
      bytes.putRawString(0, '我们');
      bytes.toString().should.equal('<ByteBuffer e6 88 91 e4 bb ac>');
      bytes.getRawString(0, 6).should.equal('我们');

      bytes.readRawString(0, 6).should.equal('我们');

      bytes = ByteBuffer.allocate(1);
      bytes.putRawString('');
      bytes.toString().should.equal('<ByteBuffer>');
    });
  });

  describe('array(), copy()', function () {
    it('should copy(start)', function () {
      var bytes = ByteBuffer.allocate(8);
      bytes.putInt(0);
      bytes.putInt(1);
      bytes.copy(4).should.eql(new Buffer([0, 0, 0, 1]));
    });

    it('should copy(start, end)', function () {
      var bytes = ByteBuffer.allocate(9);
      bytes.putInt(0);
      bytes.putInt(1);
      bytes.copy(0, 8).should.eql(new Buffer([0, 0, 0, 0, 0, 0, 0, 1]));
      bytes.copy(0, 9).should.eql(new Buffer([0, 0, 0, 0, 0, 0, 0, 1]));
      bytes.copy(0, 4).should.eql(new Buffer([0, 0, 0, 0]));
      bytes.copy(4, 8).should.eql(new Buffer([0, 0, 0, 1]));
    });
  });

  describe('_copy()', function () {
    it('should splice < 2048 ok', function () {
      var bytes = ByteBuffer.allocate(4096);
      bytes.putRawString('hello');
      bytes.putRawString('world');
      bytes._copy(0, 5).toString().should.equal('hello');
    });

    it('should splice > 2048 ok', function () {
      var bytes = ByteBuffer.allocate(4096);
      for (var i = 0; i < 800; i++) {
        bytes.putRawString('hello');
      }
      bytes._copy(1000, 4000).toString().should.have.length(3000);
    });
  });
});
