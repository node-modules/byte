/*!
 * byte - lib/byte.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var Long = require('long');

var DEFAULT_SIZE = 1024;
var BIG_ENDIAN = 1;
var LITTLE_ENDIAN = 2;

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
  if (this._size < afterSize) {
    var old = this._size;
    this._size = afterSize * 2;
    console.warn('[byte] [warning] allocate new Buffer: from %d to %d bytes', old, this._size);
    var bytes = new Buffer(this._size);
    this._bytes.copy(bytes, 0);
    this._bytes = bytes;
  }
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
    return this._bytes.slice(index, index + length);
  }
  // return byte
  return this._bytes[index];
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

ByteBuffer.prototype._putValue = function (index, value, method) {
  method += this._order === BIG_ENDIAN ? 'BE' : 'LE';
  this._bytes[method](value, index);
  return this;
};

ByteBuffer.prototype._getValue = function (index, method) {
  method += this._order === BIG_ENDIAN ? 'BE' : 'LE';
  return this._bytes[method](index);
};

ByteBuffer.prototype.putDouble = function (index, value) {
  // double
  // int, double
  var offset = 0;
  if (typeof index === 'number' && typeof value === 'number') {
    // int, double
    offset = index;
  } else {
    // double
    offset = this._offset;
    this._offset += 8;
    this._checkSize(this._offset);
    value = index;
  }
  return this._putValue(offset, value, 'writeDouble');
};

ByteBuffer.prototype.getDouble = function (index) {
  if (typeof index !== 'number') {
    index = this._offset;
    this._offset += 8;
  }
  return this._getValue(index, 'readDouble');
};

ByteBuffer.prototype.putFloat = function (index, value) {
  // float
  // int, float
  var offset = 0;
  if (typeof index === 'number' && typeof value === 'number') {
    // int, float
    offset = index;
  } else {
    // float
    offset = this._offset;
    this._offset += 4;
    this._checkSize(this._offset);
    value = index;
  }
  return this._putValue(offset, value, 'writeFloat');
};

ByteBuffer.prototype.getFloat = function (index) {
  if (typeof index !== 'number') {
    index = this._offset;
    this._offset += 4;
  }
  return this._getValue(index, 'readFloat');
};

ByteBuffer.prototype.putInt = function (index, value) {
  // int
  // int, int
  var offset = 0;
  if (typeof index === 'number' && typeof value === 'number') {
    // int, int
    offset = index;
  } else {
    // int
    offset = this._offset;
    this._offset += 4;
    this._checkSize(this._offset);
    value = index;
  }
  return this._putValue(offset, value, 'writeInt32');
};

ByteBuffer.prototype.getInt = function (index) {
  if (typeof index !== 'number') {
    index = this._offset;
    this._offset += 4;
  }
  return this._getValue(index, 'readInt32');
};

ByteBuffer.prototype.putShort = function (index, value) {
  // short
  // int, short
  var offset = 0;
  if (typeof index === 'number' && typeof value === 'number') {
    // int, short
    offset = index;
  } else {
    // short
    offset = this._offset;
    this._offset += 2;
    this._checkSize(this._offset);
    value = index;
  }
  return this._putValue(offset, value, 'writeInt16');
};

ByteBuffer.prototype.getShort = function (index) {
  if (typeof index !== 'number') {
    index = this._offset;
    this._offset += 2;
  }
  return this._getValue(index, 'readInt16');
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
  if (!(value instanceof Long)) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    value = Long.fromString(value);
  }
  if (this._order === BIG_ENDIAN) {
    this._bytes.writeInt32BE(value.high, offset);
    this._bytes.writeInt32BE(value.low, offset + 4);
  } else {
    this._bytes.writeInt32LE(value.low, offset);
    this._bytes.writeInt32LE(value.high, offset + 4);
  }
  return this;
};

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

ByteBuffer.prototype._putString = function (index, value, format) {
  if (!Buffer.isBuffer(value)) {
    value = new Buffer(value);
  }
  var length = value.length;
  if (format === 'c') {
    length++;
  }
  if (index == null) {
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
};

ByteBuffer.prototype._getString = function (index, format) {
  var moveOffset = false;
  if (index == null) {
    index = this._offset;
    moveOffset = true;
  }
  var length = this.getInt(index);

  if (moveOffset) {
    this._offset += 4 + length;
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
  this._putString(index, value, 'java');
};

ByteBuffer.prototype.putCString = function (index, value) {
  if (typeof value === 'undefined') {
    value = index;
    index = null;
  }
  this._putString(index, value, 'c');
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
  return this._bytes.slice(0, this._offset);
};

ByteBuffer.prototype.position = function (newPosition) {
  if (typeof newPosition === 'number') {
    this._offset = newPosition;
  }
  return this._offset;
};


module.exports = ByteBuffer;
