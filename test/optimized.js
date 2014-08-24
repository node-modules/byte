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

var optimized = require('optimized');
var should = require('should');
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

putBytes.put._name = 'put';
putCharBytes.putChar._name = 'putChar';
putBufferBytes.putBuffer._name = 'putBuffer';

// optimized(ByteBuffer.allocate, [1024], ByteBuffer).should.ok;

optimized(putBytes.put, [0, 1], putBytes).should.ok;
optimized(putBytes.put, [1], putBytes).should.ok;

optimized(putBufferBytes.putBuffer, [0, new Buffer([1, 2]), 1, 2], putBufferBytes).should.ok;
optimized(putBufferBytes.putBuffer, [new Buffer([1, 2]), 1, 2], putBufferBytes).should.ok;

optimized(putCharBytes.putChar, ['a'], putCharBytes);
optimized(putCharBytes.putChar, [0, 'a'], putCharBytes);
optimized(putCharBytes.putChar, [97], putCharBytes);
optimized(putCharBytes.putChar, [0, 97], putCharBytes);


// optimized(putCharBytes.getChar, [0], putCharBytes).should.ok;

// optimized(putShortBytes.putShort, [0, 1], putShortBytes).should.ok;
// optimized(putShortBytes.putShort, [1], putShortBytes).should.ok;
// optimized(putShortBytes.putShortOpt, [0, 1], putShortBytes).should.ok;
// optimized(putShortBytes.putShortOpt, [1], putShortBytes).should.ok;
// optimized(putShortBytes._putShort2, [0, 1], putShortBytes).should.ok;
// optimized(putShortBytes._putShort1, [1], putShortBytes).should.ok;

// optimized(putIntBytes.putInt, [0, 1], putIntBytes).should.ok;
// optimized(putIntBytes.putInt, [1], putIntBytes).should.ok;

// optimized(putFloatBytes.putFloat, [0, 1.1], putFloatBytes).should.ok;
// optimized(putFloatBytes.putFloat, [1.1], putFloatBytes).should.ok;

// optimized(putDoubleBytes.putDouble, [0, 1.1], putDoubleBytes).should.ok;
// optimized(putDoubleBytes.putDouble, [1.1], putDoubleBytes).should.ok;
