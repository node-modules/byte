/*!
 * byte - benchmark.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var Benchmark = require('benchmark');
var ByteBuffer = require('./');

var suite = new Benchmark.Suite();

var putBytes = ByteBuffer.allocate(1);
var putCharBytes = ByteBuffer.allocate(1);
var putShortBytes = ByteBuffer.allocate(2);
var putIntBytes = ByteBuffer.allocate(4);
var putFloatBytes = ByteBuffer.allocate(4);
var putDoubleBytes = ByteBuffer.allocate(8);
var putLongBytes = ByteBuffer.allocate(8);
var putStringBytes = ByteBuffer.allocate(100);
var putRawStringBytes = ByteBuffer.allocate(100);

var string = '';
while(string.length < 100) {
  string += 'fffff';
}

suite
.add('put()      ', function () {
  putBytes.put(0, 1);
})
.add('putChar()  ', function () {
  putCharBytes.putChar(0, 'a');
})
.add('putShort() ', function () {
  putShortBytes.putShort(0, 1);
})
.add('putInt()   ', function () {
  putIntBytes.putInt(0, 1);
})
.add('putFloat() ', function () {
  putFloatBytes.putFloat(0, 1);
})
.add('putDouble()', function () {
  putDoubleBytes.putDouble(0, 1);
})
.add('putLong()  ', function () {
  putLongBytes.putLong(0, 1);
})
.add('putString()', function () {
  putStringBytes.putString(0, string);
})
.add('putRawStr()', function () {
  putRawStringBytes.putRawString(0, string);
})
.add('get()      ', function () {
  putBytes.get(0, 1);
})
.add('getChar()  ', function () {
  putCharBytes.getChar(0);
})
.add('getShort() ', function () {
  putShortBytes.getShort(0, 1);
})
.add('getInt()   ', function () {
  putIntBytes.getInt(0, 1);
})
.add('getFloat() ', function () {
  putFloatBytes.getFloat(0, 1);
})
.add('getDouble()', function () {
  putDoubleBytes.getDouble(0, 1);
})
.add('getLong()  ', function () {
  putLongBytes.getLong(0, 1);
})
.add('getString()', function () {
  putStringBytes.getString(0);
})
.add('getRawStr()', function () {
  putRawStringBytes.getRawString(0, 100);
})
// add listeners
.on('cycle', function (event) {
  console.log(String(event.target));
})
.run({ async: false });
