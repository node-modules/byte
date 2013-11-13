/*!
 * byte - test/byte.test.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var ByteBuffer = require('../');
var should = require('should');

describe('byte.test.js', function () {
  describe('new ByteBuffer()', function () {
    it('should create ByteBuffer', function () {
      var bytes = new ByteBuffer();
      bytes.array().should.length(0);
      bytes.position().should.equal(0);
    });
  });

  describe('putChar()', function () {
    it('should put a char', function () {
      var bytes = ByteBuffer.allocate(2);
      bytes.putChar('a');
      bytes.toString().should.equal('<ByteBuffer 61>');
      bytes.putChar('A');
      bytes.toString().should.equal('<ByteBuffer 61 41>');
      bytes.putChar(255);
      bytes.toString().should.equal('<ByteBuffer 61 41 ff>');
      bytes.putChar(2, 'a');
      bytes.toString().should.equal('<ByteBuffer 61 41 61>');
      bytes.putChar('a');
      bytes.toString().should.equal('<ByteBuffer 61 41 61 61>');
      bytes.putChar('a');
      bytes.toString().should.equal('<ByteBuffer 61 41 61 61 61>');
      bytes.putChar('a');
      bytes.toString().should.equal('<ByteBuffer 61 41 61 61 61 61>');
    });
  });

  describe('putFloat()', function () {
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
        [12312877347.123123, '<ByteBuffer 50 37 79 e6>', '<ByteBuffer e6 79 37 50>']
      ];
      var bytes = ByteBuffer.allocate(4);
      bytes.putFloat(0);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00>');
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putFloat(0, item[0]);
        bytes.toString().should.equal(item[1]);
        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putFloat(0, item[0]);
        bytes.toString().should.equal(item[2]);
      });
    });
  });

  describe('putInt()', function () {
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
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putInt(0, item[0]);
        bytes.toString().should.equal(item[1]);
        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putInt(0, item[0]);
        bytes.toString().should.equal(item[2]);
      });
    });
  });

  describe('putShort()', function () {
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
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putShort(0, item[0]);
        bytes.toString().should.equal(item[1]);
        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putShort(0, item[0]);
        bytes.toString().should.equal(item[2]);
      });
    });
  });

  describe('putLong()', function () {
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
        // 2, 63 - 1
        ['-9223372036854775808', '<ByteBuffer 80 00 00 00 00 00 00 00>', '<ByteBuffer 00 00 00 00 00 00 00 80>'],
        ['-9223372036854775807', '<ByteBuffer 80 00 00 00 00 00 00 01>', '<ByteBuffer 01 00 00 00 00 00 00 80>'],
        ['9223372036854775807', '<ByteBuffer 7f ff ff ff ff ff ff ff>', '<ByteBuffer ff ff ff ff ff ff ff 7f>'],
        ['9223372036854775806', '<ByteBuffer 7f ff ff ff ff ff ff fe>', '<ByteBuffer fe ff ff ff ff ff ff 7f>'],
      ];
      var bytes = ByteBuffer.allocate(1);
      bytes.putLong(0);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00 00 00 00 00>');
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putLong(0, item[0]);
        bytes.toString().should.equal(item[1]);
        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putLong(0, item[0]);
        bytes.toString().should.equal(item[2]);
      });
    });
  });

  describe('putDouble()', function () {
    it('should put a double', function () {
      var bytes = ByteBuffer.allocate(2);
      bytes.putDouble(1);
      bytes.toString().should.equal('<ByteBuffer 3f f0 00 00 00 00 00 00>');
      bytes.putDouble(0, 0);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00 00 00 00 00>');
      bytes.putDouble(0, 2);
      bytes.toString().should.equal('<ByteBuffer 40 00 00 00 00 00 00 00>');

      bytes.putDouble(0, 1024);
      bytes.toString().should.equal('<ByteBuffer 40 90 00 00 00 00 00 00>');

      bytes.order(ByteBuffer.LITTLE_ENDIAN);
      bytes.putDouble(0, 1);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00 00 00 f0 3f>');
      bytes.putDouble(0, 1024);
      bytes.toString().should.equal('<ByteBuffer 00 00 00 00 00 00 90 40>');

      bytes.order(ByteBuffer.BIG_ENDIAN);
      bytes.putDouble(0, 1123123.123123);
      bytes.toString().should.equal('<ByteBuffer 41 31 23 33 1f 84 fd 2a>');
      bytes.order(ByteBuffer.LITTLE_ENDIAN);
      bytes.putDouble(0, 1123123.123123);
      bytes.toString().should.equal('<ByteBuffer 2a fd 84 1f 33 23 31 41>');
      bytes.order(ByteBuffer.BIG_ENDIAN);
      bytes.putDouble(1123123.123123);
      bytes.toString().should.equal('<ByteBuffer 2a fd 84 1f 33 23 31 41 41 31 23 33 1f 84 fd 2a>');
    });
  });

  describe('put()', function () {
    it('should put byte', function () {
      var bytes = ByteBuffer.allocate(1);
      bytes.put(1);
      bytes.toString().should.equal('<ByteBuffer 01>');
      bytes.put(0, 2);
      bytes.toString().should.equal('<ByteBuffer 02>');
      bytes.put(1);
      bytes.toString().should.equal('<ByteBuffer 02 01>');
      bytes.put(new Buffer([255, 255, 255]));
      bytes.toString().should.equal('<ByteBuffer 02 01 ff ff ff>');
      bytes.put(new Buffer([255, 254, 1]), 1, 2);
      bytes.toString().should.equal('<ByteBuffer 02 01 ff ff ff fe 01>');
    });
  });
});
