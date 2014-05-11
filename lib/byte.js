/*!
 * byte - lib/byte.js
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

var Long = require('long');
var debug = require('debug')('byte');
var numbers = require('./number');

var DEFAULT_SIZE = 1024;
var BIG_ENDIAN = 1;
var LITTLE_ENDIAN = 2;
var MAX_INT_31 = Math.pow(2, 31);

function ByteBuffer(options) {
  options = options || {};
  this._order = options.order || BIG_ENDIAN;
  this._size = options.size || DEFAULT_SIZE;
  this._offset = 0;
  var array = options.array;
  if (array) {
    this._bytes = array;
  } else {
    this._bytes = new Buffer(this._size);
  }
}

ByteBuffer.BIG_ENDIAN = BIG_ENDIAN;
ByteBuffer.LITTLE_ENDIAN = LITTLE_ENDIAN;

ByteBuffer.allocate = function (capacity) {
  return new ByteBuffer({size: capacity});
};

ByteBuffer.wrap = function (array, offset, length) {
  if (offset) {
    var end = offset + (length || array.length);
    array = array.slice(offset, end);
  }
  return new ByteBuffer({array: array, size: array.length});
};

ByteBuffer.prototype.order = function (order) {
  this._order = order;
  return this;
};

ByteBuffer.prototype._checkSize = function (afterSize) {
  if (this._size >= afterSize) {
    return;
  }
  var old = this._size;
  this._size = afterSize * 2;
  debug('allocate new Buffer: from %d to %d bytes', old, this._size);
  var bytes = new Buffer(this._size);
  this._bytes.copy(bytes, 0);
  this._bytes = bytes;
};

ByteBuffer.prototype.put = function (src, offset, length) {
  // byte
  // bytes, offset, length
  // index, byte
  var index = this._offset;
  if (Buffer.isBuffer(src)) {
    // bytes, offset, length
    offset = offset || 0;
    length = length || src.length;
    this._offset += length;
    this._checkSize(this._offset);
    src.copy(this._bytes, index, offset, offset + length);
  } else if (typeof src === 'number') {
    if (typeof offset === 'number') {
      // index, byte
      index = src;
      src = offset;
    } else {
      // byte
      index = this._offset;
      this._offset++;
      this._checkSize(this._offset);
    }
    this._bytes[index] = src;
  }
  return this;
};

ByteBuffer.prototype.get = function (index, length) {
  if (typeof index !== 'number') {
    index = this._offset++;
  } else if (typeof length === 'number') {
    // offset, length => Buffer
    return this._fastSlice(index, index + length);
  }
  // return byte
  return this._bytes[index];
};

ByteBuffer.prototype.read = function (size) {
  var index = this._offset;
  this._offset += size;
  return this._bytes.slice(index, this._offset);
};

ByteBuffer.prototype.putChar = function (index, value) {
  // char
  // int, char
  if (value === undefined) {
    // char
    value = index;
    index = this._offset;
    this._offset++;
    this._checkSize(this._offset);
  } else {
    // int, char
  }
  this._bytes[index] = typeof value === 'string' ? value.charCodeAt(0) : value;
  return this;
};

ByteBuffer.prototype.getChar = function (index) {
  var b = this.get(index);
  return String.fromCharCode(b);
};

Object.keys(numbers).forEach(function (type) {
  var putMethod = 'put' + type;
  var getMethod = 'get' + type;
  var handles = numbers[type];
  var size = handles.size;

  ByteBuffer.prototype[putMethod] = function (index, value) {
    var offset = 0;
    if (typeof index === 'number' && typeof value === 'number') {
      //index, value
      offset = index;
    } else {
      //value
      offset = this._offset;
      this._offset += size;
      this._checkSize(this._offset);
      value = index;
    }

    var handle = this._order === BIG_ENDIAN
      ? handles.writeBE
      : handles.writeLE;
    this._bytes[handle](value, offset);
  };

  ByteBuffer.prototype[getMethod] = function (index) {
    if (typeof index !== 'number') {
      index = this._offset;
      this._offset += size;
    }

    var handle = this._order === BIG_ENDIAN
      ? handles.readBE
      : handles.readLE;
    return this._bytes[handle](index);
  };
});

ByteBuffer.prototype._putZero = function (index) {
  this._bytes[index] = 0;
  this._bytes[index + 1] = 0;
  this._bytes[index + 2] = 0;
  this._bytes[index + 3] = 0;
};

ByteBuffer.prototype._putFF = function (index) {
  this._bytes[index] = 0xff;
  this._bytes[index + 1] = 0xff;
  this._bytes[index + 2] = 0xff;
  this._bytes[index + 3] = 0xff;
};

ByteBuffer.prototype.putLong = function (index, value) {
  // long
  // int, long
  var offset = 0;
  if (value === undefined) {
    // long
    offset = this._offset;
    this._offset += 8;
    this._checkSize(this._offset);
    value = index;
  } else {
    // int, long
    offset = index;
  }

  // get the offset
  var highOffset = offset;
  var lowOffset = offset + 4;
  if (this._order !== BIG_ENDIAN) {
    highOffset = offset + 4;
    lowOffset = offset;
  }

  // int
  if (typeof value === 'number'
    && value < MAX_INT_31
    && value >= -MAX_INT_31) {
    // put high
    value < 0
      ? this._putFF(highOffset)
      : this._putZero(highOffset);
    if (this._order === BIG_ENDIAN) {
      this._bytes.writeInt32BE(value, lowOffset);
    } else {
      this._bytes.writeInt32LE(value, lowOffset);
    }
    return this;
  }

  // long number or string, make it a Long Object
  // TODO: Long object's performence has big problem
  if (typeof value.low !== 'number'
    || typeof value.high !== 'number') {
    // not Long instance, must be Number or String
    value = typeof value === 'number'
      ? Long.fromNumber(value)
      : Long.fromString(value);
  }

  // write
  if (this._order === BIG_ENDIAN) {
    this._bytes.writeInt32BE(value.high, highOffset);
    this._bytes.writeInt32BE(value.low, lowOffset);
  } else {
    this._bytes.writeInt32LE(value.high, highOffset);
    this._bytes.writeInt32LE(value.low, lowOffset);
  }

  return this;
};

ByteBuffer.prototype.putInt64 = ByteBuffer.prototype.putLong;

ByteBuffer.prototype.getLong = function (index) {
  if (typeof index !== 'number') {
    index = this._offset;
    this._offset += 8;
  }
  if (this._order === BIG_ENDIAN) {
    return new Long(
      this._bytes.readInt32BE(index + 4), // low, high
      this._bytes.readInt32BE(index)
    );
  } else {
    return new Long(
      this._bytes.readInt32LE(index),
      this._bytes.readInt32LE(index + 4)
    );
  }
};

ByteBuffer.prototype.getInt64 = ByteBuffer.prototype.getLong;

ByteBuffer.prototype._putString = function (index, value, format) {
  if (!value || value.length === 0) {
    // empty string
    if (index === null || index === undefined) {
      index = this._offset;
      this._offset += 4;
      this._checkSize(this._offset);
    }
    return this.putInt(index, 0);
  }

  if (!Buffer.isBuffer(value)) {
    value = new Buffer(value);
  }
  var length = value.length;
  if (format === 'c') {
    length++;
  }
  if (index === null || index === undefined) {
    index = this._offset;
    this._offset += length + 4;
    this._checkSize(this._offset);
  }
  this.putInt(index, length);
  var valueOffset = index + 4;
  value.copy(this._bytes, valueOffset);
  if (format === 'c') {
    this.put(valueOffset + value.length, 0);
  }

  return this;
};

ByteBuffer.prototype.putRawString = function (index, str) {
  if (typeof index === 'string') {
    // str
    str = index;
    index = this._offset;
    this._offset += Buffer.byteLength(str);
    this._checkSize(this._offset);
  }

  if (!str || str.length === 0) {
    return this;
  }
  this._bytes.write(str, index);
  return this;
};

ByteBuffer.prototype._fastSlice = function (start, end) {
  // magic number here..
  if (end - start > 2048) {
    return this._bytes.slice(start, end);
  }
  var buf = new Buffer(end - start);
  this._bytes.copy(buf, 0, start, end);
  return buf;
};

ByteBuffer.prototype.getRawString = function (index, length) {
  if (typeof index !== 'number') {
    index = this._offset++;
  } else if (typeof length === 'number') {
    return this._fastSlice(index, index + length).toString();
  }
  return String.fromCharCode(this._bytes[index]);
};

ByteBuffer.prototype.readRawString = function (length) {
  var index = this._offset;
  this._offset += length;
  return this._fastSlice(index, this._offset).toString();
};

ByteBuffer.prototype._getString = function (index, format) {
  var moveOffset = false;
  if (index === null || index === undefined) {
    index = this._offset;
    moveOffset = true;
  }
  var length = this.getInt(index);

  if (moveOffset) {
    this._offset += 4 + length;
  }

  if (length === 0) {
    // empty string
    return '';
  }

  if (format === 'c') {
    length--;
  }
  return this.get(index + 4, length).toString();
};

ByteBuffer.prototype.putString = function (index, value) {
  if (typeof value === 'undefined') {
    value = index;
    index = null;
  }
  return this._putString(index, value, 'java');
};

ByteBuffer.prototype.putCString = function (index, value) {
  if (typeof value === 'undefined') {
    value = index;
    index = null;
  }
  return this._putString(index, value, 'c');
};

ByteBuffer.prototype.getString = function (index) {
  return this._getString(index, 'java');
};

ByteBuffer.prototype.getCString = function (index) {
  return this._getString(index, 'c');
};

ByteBuffer.prototype.toString = function () {
  var s = '<ByteBuffer';
  for (var i = 0; i < this._offset; i++) {
    var c = this._bytes[i].toString('16');
    if (c.length === 1) {
      c = '0' + c;
    }
    s += ' ' + c;
  }
  s += '>';
  return s;
};

ByteBuffer.prototype.array = function () {
  return this._fastSlice(0, this._offset);
};

ByteBuffer.prototype.position = function (newPosition) {
  if (typeof newPosition === 'number') {
    this._offset = newPosition;
    // make `bytes.position(1).read();` chain
    return this;
  }
  return this._offset;
};

ByteBuffer.prototype.skip = function (size) {
  this._offset += size;
};

module.exports = ByteBuffer;
