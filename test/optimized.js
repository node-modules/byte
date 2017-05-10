/*!
 * byte - test/optimized.js
 *
 * Copyright(c) 2013 - 2014
 * MIT Licensed
 *
 * Authors:
 *   dead-horse <dead_horse@qq.com> (https://github.com/dead-horse)
 */

"use strict";

/**
 * Module dependencies.
 */

var assert = require('assert');
var optimized = require('optimized');
var ByteBuffer = require('..');

var putBytes = ByteBuffer.allocate(2);
var putBufferBytes = ByteBuffer.allocate(2);
var putCharBytes = ByteBuffer.allocate(2);
var putShortBytes = ByteBuffer.allocate(4);
var putIntBytes = ByteBuffer.allocate(8);
var putFloatBytes = ByteBuffer.allocate(8);
var putDoubleBytes = ByteBuffer.allocate(16);
var putLongBytes = ByteBuffer.allocate(16);
var putBigLongBytes = ByteBuffer.allocate(16);
var putStringBytes = ByteBuffer.allocate(208);
var putCStringBytes = ByteBuffer.allocate(210);
var putBufStringBytes = ByteBuffer.allocate(208);
var putRawStringBytes = ByteBuffer.allocate(208);

// putCharBytes.putChar(0, 'a');
// putCharBytes.putChar(0, 61);
// putShortBytes.putShort(0, 1);
// putIntBytes.putInt(0, 1);
// putFloatBytes.putFloat(0, 1);
// putDoubleBytes.putDouble(0, 1);
// putLongBytes.putLong(0, 100000);
// putLongBytes.putLong(0, '10000');
// putLongBytes.putLong(0, 34359738368);
// putLongBytes.putLong(0, "34359738368");
// putLongBytes.putLong(0, '9223372036854775808');
// ByteBuffer.allocate(100).putString(0, string);
// putStringBytes.putString(0, string);
// putCStringBytes.putCString(0, string);
// putBufStringBytes.putString(0, bufString);
// putRawStringBytes.putRawString(0, string);

putBytes._checkSize._name = '_checkSize';
putBytes.put._name = 'put';
putBytes.get._name = 'get';
putBytes.read._name = 'read';
putCharBytes.putChar._name = 'putChar';
putCharBytes.getChar._name = 'getChar';
putShortBytes.putShort._name = 'putShort';
putIntBytes.putInt._name = 'putInt';
putFloatBytes.putFloat._name = 'putFloat';
putDoubleBytes.putDouble._name = 'putDouble';

assert(optimized(putBytes._checkSize, [0], putBytes));
assert(optimized(putBytes._checkSize, [100], putBytes));

assert(optimized(putBytes.put, [0, 1], putBytes));
assert(optimized(putBytes.put, [1], putBytes));
assert(optimized(putBytes.put, [new Buffer([1, 2]), 1, 2], putBytes));

assert(optimized(putBytes.get, [0, 1], putBytes));
assert(optimized(putBytes.get, [1], putBytes));

assert(optimized(putBytes.read, [1], putBytes));

assert(optimized(putCharBytes.putChar, ['a'], putCharBytes));
assert(optimized(putCharBytes.putChar, [0, 'a'], putCharBytes));
assert(optimized(putCharBytes.putChar, [97], putCharBytes));
assert(optimized(putCharBytes.putChar, [0, 97], putCharBytes));

assert(optimized(putCharBytes.getChar, [], putCharBytes));
assert(optimized(putCharBytes.getChar, [0], putCharBytes));

assert(optimized(putShortBytes.putShort, [0, 1], putShortBytes));
assert(optimized(putShortBytes.putShort, [1], putShortBytes));

assert(optimized(putIntBytes.putInt, [0, 1], putIntBytes));
assert(optimized(putIntBytes.putInt, [1], putIntBytes));

assert(optimized(putFloatBytes.putFloat, [0, 1.1], putFloatBytes));
assert(optimized(putFloatBytes.putFloat, [1.1], putFloatBytes));

assert(optimized(putDoubleBytes.putDouble, [0, 1.1], putDoubleBytes));
assert(optimized(putDoubleBytes.putDouble, [1.1], putDoubleBytes));
