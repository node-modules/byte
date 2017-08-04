'use strict';

var Long = require('long');
var assert = require('assert');
var ByteBuffer = require('../');

describe('byte.test.js', function () {
  describe('new ByteBuffer()', function () {
    it('should create ByteBuffer', function () {
      var bytes = new ByteBuffer();
      assert(bytes.array().length === 0);
      assert(bytes.position() === 0);
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
      assert(bytes.getString() === '');
      assert(bytes.getString() === '');
      assert(bytes.getString() === '');
      assert(bytes.getString() === '');
    });

    it('should put strings', function () {
      var bytes = new ByteBuffer({size: 10});
      bytes.putString('foo, 中文');
      assert(bytes.getString(0) === 'foo, 中文');
      bytes.putString(0, 'foo, 中国');
      assert(bytes.getString(0) === 'foo, 中国');
      bytes.putString(0, new Buffer('foo, 中国'));
      assert(bytes.getString(0) === 'foo, 中国');
      bytes.putString('foo2');
      assert(bytes.getString(new Buffer('foo, 中国').length + 4) === 'foo2');

      bytes.position(0);
      assert(bytes.getString() === 'foo, 中国');

      bytes = new ByteBuffer({size: 1});
      bytes.putCString(0, '');
      assert(bytes._size === 4 * 2);

      bytes = new ByteBuffer({size: 10});
      bytes.putCString('foo, \u0000中文\u0000');
      assert(bytes.getCString(0) === 'foo, \u0000中文\u0000');
      bytes.putCString(0, 'bar123123, \u0000中文\u0000');
      assert(bytes.getCString(0) === 'bar123123, \u0000中文\u0000');
      var lbadstr = 'bar123123123123123123123123123123123123, \u0000中文\u0000';
      bytes.putCString(0, lbadstr);
      assert(bytes.getCString(0) === lbadstr);

      bytes.position(0);
      bytes.putCString('bar123123, \u0000中文\u0000');
      bytes.putCString('foo2foo, \u0000中文\u0000');
      assert(
        bytes.getCString(new Buffer('bar123123, \u0000中文\u0000').length + 4 + 1) === 'foo2foo, \u0000中文\u0000'
      );

      bytes.position(0);
      assert(bytes.getCString() === 'bar123123, \u0000中文\u0000');
    });
  });

  describe('putChar(), getChar()', function () {
    it('should put a char', function () {
      var bytes = ByteBuffer.allocate(2);
      bytes.putChar('a');
      assert(bytes.toString() === '<ByteBuffer 61>');
      bytes.putChar('A');
      assert(bytes.toString() === '<ByteBuffer 61 41>');
      bytes.putChar(255);
      assert(bytes.toString() === '<ByteBuffer 61 41 ff>');
      bytes.putChar(2, 'a');
      assert(bytes.toString() === '<ByteBuffer 61 41 61>');
      bytes.putChar('a');
      assert(bytes.toString() === '<ByteBuffer 61 41 61 61>');
      bytes.putChar('a');
      assert(bytes.toString() === '<ByteBuffer 61 41 61 61 61>');
      bytes.putChar('a');
      assert(bytes.toString() === '<ByteBuffer 61 41 61 61 61 61>');

      bytes.position(0);
      assert(bytes.getChar() === 'a');
      assert(bytes.getChar() === 'A');
      assert(bytes.getChar() === 'a');
      assert(bytes.getChar() === 'a');
      assert(bytes.getChar() === 'a');
      assert(bytes.getChar() === 'a');
      assert(bytes.getChar(1) === 'A');
      assert(bytes.position() === 6);
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
      assert(bytes.toString() === '<ByteBuffer 00 00 00 00>');
      bytes.position(0);
      assert(bytes.getFloat() === 0);
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putFloat(0, item[0]);
        assert(bytes.toString() === item[1]);
        assert(String(bytes.getFloat(0)).indexOf(item[0]) >= 0);

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putFloat(0, item[0]);
        assert(bytes.toString() === item[2]);
        assert(String(bytes.getFloat(0)).indexOf(item[0]) >= 0);
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
      assert(bytes.toString() === '<ByteBuffer 00 00 00 00>');
      bytes.position(0);
      assert(bytes.getInt() === 0);
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putInt(0, item[0]);
        assert(bytes.toString() === item[1]);
        assert(bytes.getInt(0) === item[0]);

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putInt(0, item[0]);
        assert(bytes.toString() === item[2]);
        assert(bytes.getInt(0) === item[0]);
      });
    });
  });

  describe('putInt8(), getInt8(), putUInt8(), getUInt8()', function () {
    it('should put and get 8 bits int', function () {
      var bytes = ByteBuffer.allocate(1);
      bytes.putInt8(-128);
      assert(bytes.toString() === '<ByteBuffer 80>');
      bytes.putInt8(0, -128);
      assert(bytes.toString() === '<ByteBuffer 80>');
      bytes.position(0);
      assert(bytes.getInt8() === -128);
      bytes.putInt8(0, 0);
      assert(bytes.toString() === '<ByteBuffer 00>');
      assert(bytes.getInt8(0) === 0);

      bytes.putInt8(0, -128);
      assert(bytes.toString() === '<ByteBuffer 80>');

      bytes.putInt8(0, 127);
      assert(bytes.toString() === '<ByteBuffer 7f>');

      bytes.position(0);
      bytes.putUInt8(255);
      assert(bytes.toString() === '<ByteBuffer ff>');
      bytes.position(0);
      assert(bytes.getUInt8() === 255);

      assert(bytes.putUInt8(0, 0).toString() === '<ByteBuffer 00>');
      assert(bytes.putUInt8(0, 0).getUInt8(0) === 0);
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
      assert(bytes.toString() === '<ByteBuffer 00 00 00 00>');
      bytes.position(0);
      assert(bytes.getUInt() === 0);
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putUInt(0, item[0]);
        assert(bytes.toString() === item[1]);
        assert(bytes.getUInt(0) === item[0]);

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putUInt(0, item[0]);
        assert(bytes.toString() === item[2]);
        assert(bytes.getUInt(0) === item[0]);
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
      assert(bytes.toString() === '<ByteBuffer 00 00>');
      bytes.position(0);
      assert(bytes.getShort() === 0);

      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putShort(0, item[0]);
        assert(bytes.toString() === item[1]);
        assert(bytes.getShort(0) === item[0]);

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putShort(0, item[0]);
        assert(bytes.toString() === item[2]);
        assert(bytes.getShort(0) === item[0]);
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
      assert(bytes.toString() === '<ByteBuffer 00 00>');
      bytes.position(0);
      assert(bytes.getUInt16() === 0);

      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putUInt16(0, item[0]);
        assert(bytes.toString() === item[1]);
        assert(bytes.getUInt16(0) === item[0]);

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putUInt16(0, item[0]);
        assert(bytes.toString() === item[2]);
        assert(bytes.getUInt16(0) === item[0]);
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
      assert(bytes.toString() === '<ByteBuffer 00 00 00 00 00 00 00 00>');
      bytes.position(0);
      assert(bytes.getLong().toString() === '0');
      cases.forEach(function (item) {
        bytes.order(ByteBuffer.BIG_ENDIAN);
        bytes.putLong(0, item[0]);
        assert(bytes.toString() === item[1]);
        assert(bytes.getLong(0).toString() === String(item[0]));

        bytes.order(ByteBuffer.LITTLE_ENDIAN);
        bytes.putLong(0, item[0]);
        assert(bytes.toString() === item[2]);
        assert(bytes.getLong(0).toString() === String(item[0]));
      });
    });
  });

  describe('putDouble(), getDouble()', function () {
    it('should put a double', function () {
      var bytes = ByteBuffer.allocate(2);
      bytes.putDouble(1);
      assert(bytes.toString() === '<ByteBuffer 3f f0 00 00 00 00 00 00>');
      bytes.position(0);
      assert(bytes.getDouble() === 1);

      bytes.putDouble(0, 0);
      assert(bytes.toString() === '<ByteBuffer 00 00 00 00 00 00 00 00>');
      assert(bytes.getDouble(0) === 0);

      bytes.putDouble(0, 2);
      assert(bytes.toString() === '<ByteBuffer 40 00 00 00 00 00 00 00>');
      assert(bytes.getDouble(0) === 2);

      bytes.putDouble(0, 1024);
      assert(bytes.toString() === '<ByteBuffer 40 90 00 00 00 00 00 00>');
      assert(bytes.getDouble(0) === 1024);

      bytes.order(ByteBuffer.LITTLE_ENDIAN);
      bytes.putDouble(0, 1);
      assert(bytes.toString() === '<ByteBuffer 00 00 00 00 00 00 f0 3f>');
      assert(bytes.getDouble(0) === 1);

      bytes.putDouble(0, 1024);
      assert(bytes.toString() === '<ByteBuffer 00 00 00 00 00 00 90 40>');
      assert(bytes.getDouble(0) === 1024);

      bytes.order(ByteBuffer.BIG_ENDIAN);
      bytes.putDouble(0, 1123123.123123);
      assert(bytes.toString() === '<ByteBuffer 41 31 23 33 1f 84 fd 2a>');
      assert(bytes.getDouble(0) === 1123123.123123);

      bytes.order(ByteBuffer.LITTLE_ENDIAN);
      bytes.putDouble(0, 1123123.123123);
      assert(bytes.toString() === '<ByteBuffer 2a fd 84 1f 33 23 31 41>');
      assert(bytes.getDouble(0) === 1123123.123123);

      bytes.order(ByteBuffer.BIG_ENDIAN);
      bytes.putDouble(1123123.123123);
      assert(
        bytes.toString() === '<ByteBuffer 2a fd 84 1f 33 23 31 41 41 31 23 33 1f 84 fd 2a>'
      );
      assert(bytes.getDouble(8) === 1123123.123123);

      assert(ByteBuffer.wrap(bytes.array()).getDouble(8) === 1123123.123123);
      assert(ByteBuffer.wrap(bytes.array(), 8, 8).getDouble(0) === 1123123.123123);
    });
  });

  describe('put()', function () {
    it('should put byte', function () {
      var bytes = ByteBuffer.allocate(1);
      bytes.put(1);
      assert(bytes.toString() === '<ByteBuffer 01>');
      assert(bytes.get(0) === 1);
      assert(bytes.getByte(0) === 1);
      bytes.reset();
      assert(bytes.getByte() === 1);

      bytes.put(0, 2);
      assert(bytes.toString() === '<ByteBuffer 02>');
      assert(bytes.get(0) === 2);

      bytes.put(1);
      assert(bytes.toString() === '<ByteBuffer 02 01>');
      assert(bytes.get(1) === 1);

      bytes.put(new Buffer([255, 255, 255]));
      assert(bytes.toString() === '<ByteBuffer 02 01 ff ff ff>');
      assert.deepEqual(bytes.get(2, 3), new Buffer([255, 255, 255]));

      bytes.put(new Buffer([255, 254, 1]), 1, 2);
      assert(bytes.toString() === '<ByteBuffer 02 01 ff ff ff fe 01>');
      assert.deepEqual(bytes.get(5, 2), new Buffer([254, 1]));

      bytes.position(0);
      assert.deepEqual(bytes.read(7), new Buffer([2, 1, 255, 255, 255, 254, 1]));
      assert(bytes.position() === 7);

      bytes.position(0);
      bytes.skip(5);
      assert.deepEqual(bytes.read(2), new Buffer([254, 1]));
      assert(bytes.position() === 7);
    });
  });

  describe('putRawString()', function () {
    it('should put raw string', function () {
      var bytes = ByteBuffer.allocate(1);
      bytes.putRawString('hello');
      bytes.putRawString(' world');
      assert(bytes.toString() === '<ByteBuffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>');
      assert(bytes.getRawString(0, 11) === 'hello world');
      bytes.position(0);
      assert(bytes.getRawString() === 'h');

      bytes = ByteBuffer.allocate(1);
      bytes.putRawString('你好');
      assert(bytes.toString() === '<ByteBuffer e4 bd a0 e5 a5 bd>');
      assert(bytes.position(0).readRawString(6) === '你好');
      bytes.putRawString(0, '我们');
      assert(bytes.toString() === '<ByteBuffer e6 88 91 e4 bb ac>');
      assert(bytes.getRawString(0, 6) === '我们');

      assert(bytes.readRawString(0, 6) === '我们');

      bytes = ByteBuffer.allocate(1);
      bytes.putRawString('');
      assert(bytes.toString() === '<ByteBuffer>');
    });

    it('should 000000000xxxxxxx (0x0000 ~ 0x007f) => 0xxxxxxx (0x00 ~ 0x7f)', function() {
      // UTF-8
      var bytes = ByteBuffer.allocate(1);
      bytes.putString(String.fromCharCode(0x0000));
      assert(bytes.toString() === '<ByteBuffer 00 00 00 01 00>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString(String.fromCharCode(0x0000));
      assert(bytes.toString() === '<ByteBuffer 00>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString(String.fromCharCode(0x0001));
      assert(bytes.toString() === '<ByteBuffer 00 00 00 01 01>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString(String.fromCharCode(0x0001));
      assert(bytes.toString() === '<ByteBuffer 01>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString('E'); // 0x45
      assert(bytes.toString() === '<ByteBuffer 00 00 00 01 45>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString('E');
      assert(bytes.toString() === '<ByteBuffer 45>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString(String.fromCharCode(0x7F));
      assert(bytes.toString() === '<ByteBuffer 00 00 00 01 7f>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString(String.fromCharCode(0x7F));
      assert(bytes.toString() === '<ByteBuffer 7f>');
    });

    it('should 00000yyyyyxxxxxx (0x0080 ~ 0x07ff) => 110yyyyy (0xc0 ~ 0xdf) | 10xxxxxx (0x80 ~ 0xbf)', function() {
      // UTF-8
      var bytes = ByteBuffer.allocate(1);
      bytes = ByteBuffer.allocate(1);
      bytes.putString(String.fromCharCode(0x80));
      assert(bytes.toString() === '<ByteBuffer 00 00 00 02 c2 80>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString(String.fromCharCode(0x80));
      assert(bytes.toString() === '<ByteBuffer c2 80>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString('ȅ'); // 0x0205: 517
      assert(bytes.toString() === '<ByteBuffer 00 00 00 02 c8 85>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString('ȅ');
      assert(bytes.toString() === '<ByteBuffer c8 85>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString(String.fromCharCode(0x81));
      assert(bytes.toString() === '<ByteBuffer 00 00 00 02 c2 81>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString(String.fromCharCode(0x81));
      assert(bytes.toString() === '<ByteBuffer c2 81>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString(String.fromCharCode(0x7FE));
      assert(bytes.toString() === '<ByteBuffer 00 00 00 02 df be>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString(String.fromCharCode(0x7FE));
      assert(bytes.toString() === '<ByteBuffer df be>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString(String.fromCharCode(0x7FF));
      assert(bytes.toString() === '<ByteBuffer 00 00 00 02 df bf>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString(String.fromCharCode(0x7FF));
      assert(bytes.toString() === '<ByteBuffer df bf>');
    });

    it('should zzzzyyyyyyxxxxxx (0x0800 ~ 0xffff) => 1110zzzz (0xe0 ~ 0xef) | 10yyyyyy (0x80 ~ 0xbf) | 10xxxxxx (0x80 ~ 0xbf)', function() {
      // UTF-8
      var bytes = ByteBuffer.allocate(1);
      bytes = ByteBuffer.allocate(1);
      bytes.putString(String.fromCharCode(0x800));
      assert(bytes.toString() === '<ByteBuffer 00 00 00 03 e0 a0 80>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString(String.fromCharCode(0x800));
      assert(bytes.toString() === '<ByteBuffer e0 a0 80>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString(String.fromCharCode(0x801));
      assert(bytes.toString() === '<ByteBuffer 00 00 00 03 e0 a0 81>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString(String.fromCharCode(0x801));
      assert(bytes.toString() === '<ByteBuffer e0 a0 81>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString('𐐀'); // 0xD801 0xDC00
      assert(bytes.toString() === '<ByteBuffer 00 00 00 04 f0 90 90 80>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString('𐐀');
      assert(bytes.toString() === '<ByteBuffer ed a0 81 ed b0 80>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString('\ud801\udc01'); // 0xD801 0xDC01
      assert(bytes.toString() === '<ByteBuffer 00 00 00 04 f0 90 90 81>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString('\ud801\udc01');
      assert(bytes.toString() === '<ByteBuffer ed a0 81 ed b0 81>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString(String.fromCharCode(0xFFFE));
      assert(bytes.toString() === '<ByteBuffer 00 00 00 03 ef bf be>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString(String.fromCharCode(0xFFFE));
      assert(bytes.toString() === '<ByteBuffer ef bf be>');

      // UTF-8
      bytes = ByteBuffer.allocate(1);
      bytes.putString(String.fromCharCode(0xFFFF));
      assert(bytes.toString() === '<ByteBuffer 00 00 00 03 ef bf bf>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString(String.fromCharCode(0xFFFF));
      assert(bytes.toString() === '<ByteBuffer ef bf bf>');
    });

    it('U+10000 ~ U+10FFFF', function() {
      // https://en.wikipedia.org/wiki/UTF-8
      // UTF-8
      var bytes = ByteBuffer.allocate(1);
      bytes = ByteBuffer.allocate(1);
      bytes.putUTF8RawString('𐍈');
      assert(bytes.toString() === '<ByteBuffer f0 90 8d 88>');
      // CESU-8
      bytes = ByteBuffer.allocate(1);
      bytes.putRawString('𐍈');
      assert(bytes.toString() === '<ByteBuffer ed a0 80 ed bd 88>');
    });

    it('should put emoji', function () {
      // utf8
      var bytes = ByteBuffer.allocate(1);
      var str = 'hello\u9983\u5c32';
      bytes.putRawString(str);
      assert(bytes.toString() === '<ByteBuffer 68 65 6c 6c 6f e9 a6 83 e5 b0 b2>');
      assert.deepEqual(bytes.getRawString(0, 11), str);
      // gbk
      var bytes = ByteBuffer.allocate(1);
      var str = 'hello\ud83c\udf3c';
      bytes.putRawString(str);
      assert(bytes.toString() === '<ByteBuffer 68 65 6c 6c 6f ed a0 bc ed bc bc>');
      assert.deepEqual(bytes.getRawString(0, 11), str);

      var bytes = ByteBuffer.allocate(1);
      // java encode bytes: [-19, -96, -67, -19, -72, -128, 87, 119, 119, -23, -126, -93]
      var str = '\ud83d\ude00Www那';
      bytes.putRawString(str);
      assert(bytes.toString() === '<ByteBuffer ed a0 bd ed b8 80 57 77 77 e9 82 a3>');
      assert.deepEqual(bytes.getRawString(0, 12), str);

      // Construction of a special test case which triggers the bug
      // of allocating insufficient space via _checkSize
      var bytes = ByteBuffer.allocate(4);
      var str = '\ud83d\ude00';
      bytes.putRawString(str);
      assert(bytes.toString() === '<ByteBuffer ed a0 bd ed b8 80>');
    });
  });

  describe('array(), copy()', function () {
    it('should copy(start)', function () {
      var bytes = ByteBuffer.allocate(8);
      bytes.putInt(0);
      bytes.putInt(1);
      assert.deepEqual(bytes.copy(4), new Buffer([0, 0, 0, 1]));
    });

    it('should copy(start, end)', function () {
      var bytes = ByteBuffer.allocate(9);
      bytes.putInt(0);
      bytes.putInt(1);
      assert.deepEqual(bytes.copy(0, 8), new Buffer([0, 0, 0, 0, 0, 0, 0, 1]));
      assert.deepEqual(bytes.copy(0, 9), new Buffer([0, 0, 0, 0, 0, 0, 0, 1]));
      assert.deepEqual(bytes.copy(0, 4), new Buffer([0, 0, 0, 0]));
      assert.deepEqual(bytes.copy(4, 8), new Buffer([0, 0, 0, 1]));
    });
  });

  describe('_copy()', function () {
    it('should splice < 2048 ok', function () {
      var bytes = ByteBuffer.allocate(4096);
      bytes.putRawString('hello');
      bytes.putRawString('world');
      assert(bytes._copy(0, 5).toString() === 'hello');
    });

    it('should splice > 2048 ok', function () {
      var bytes = ByteBuffer.allocate(4096);
      for (var i = 0; i < 800; i++) {
        bytes.putRawString('hello');
      }
      assert(bytes._copy(1000, 4000).toString().length === 3000);
    });
  });

  describe('capacity()', function () {
    it('should capacity()', function () {
      var bytes = ByteBuffer.allocate(4);
      bytes.putInt(0);
      assert(bytes.capacity() === 4);
      bytes.putInt(1);
      assert(bytes.capacity() === 16);
      bytes.flip();
      assert(bytes.capacity() === 16);
    });
  });

  describe('remaining(), hasRemaining()', function () {
    it('should remaining(), hasRemaining()', function () {
      var bytes = ByteBuffer.allocate(8);
      assert(bytes.remaining() === 8);
      assert(bytes.hasRemaining());
      bytes.put(1);
      assert(bytes.remaining() === 7);
      assert(bytes.hasRemaining());
      bytes.putShort(2);
      assert(bytes.remaining() === 5);
      assert(bytes.hasRemaining());
      bytes.put(1);
      bytes.putInt(1);
      assert(bytes.remaining() === 0);
      assert(!bytes.hasRemaining());
    });
  });

  describe('flip(), limit()', function () {
    it('should flip(), limit()', function () {
      var bytes = ByteBuffer.allocate(8);
      assert(bytes.limit() === 8);
      bytes.putInt(1);
      assert(bytes.limit() === 8);
      bytes.flip();
      assert(bytes.limit() === 4);
    });

    it('should limit(newLimit)', function () {
      var bytes = ByteBuffer.allocate(8);
      assert(bytes.limit() === 8);
      assert(bytes.limit(4).limit() === 4);
    });
  });

  describe('get(dst, offset, length)', function () {
   it('should get(dst, offset, length)', function () {
     var bytes = ByteBuffer.allocate(4);
     bytes.putInt(1);
     bytes.flip(); // switch to read mode
     var buf = new Buffer(4);
     bytes.get(buf);
     assert.deepEqual(buf, new Buffer([0, 0, 0, 1]));

     var buf2 = new Buffer(1);
     assert.throws(function() {
       bytes.get(buf2);
     }, 'BufferOverflowException');
   });

   it('should get(dst, offset, length) again', function () {
     var bytes = ByteBuffer.allocate(8);
     bytes.putInt(1);
     bytes.putInt(5);
     bytes.flip(); // switch to read mode
     var buf = new Buffer(4);
     bytes.get(buf);
     assert.deepEqual(buf, new Buffer([0, 0, 0, 1]));
     bytes.get(buf);
     assert.deepEqual(buf, new Buffer([0, 0, 0, 5]));
   });
  });
});
