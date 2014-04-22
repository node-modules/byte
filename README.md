byte
=======

[![Build Status](https://secure.travis-ci.org/node-modules/byte.png)](http://travis-ci.org/node-modules/byte)

[![Coverage Status](https://coveralls.io/repos/node-modules/byte/badge.png)](https://coveralls.io/r/node-modules/byte)

[![Dependency Status](https://gemnasium.com/node-modules/byte.png)](https://gemnasium.com/node-modules/byte)

[![NPM](https://nodei.co/npm/byte.png?downloads=true&stars=true)](https://nodei.co/npm/byte)

![logo](https://raw.github.com/node-modules/byte/master/logo.png)

Input Buffer and Output Buffer, just like Java [`ByteBuffer`](http://docs.oracle.com/javase/6/docs/api/java/nio/ByteBuffer.html).

## Install

```bash
$ npm install byte
```

## Usage

All methods just like Java ByteBuffer, you find them out [here](http://docs.oracle.com/javase/6/docs/api/java/nio/ByteBuffer.html#method_summary).

```js
var ByteBuffer = require('byte');

var bb = ByteBuffer.allocate(1024);
bb.order(ByteBuffer.BIG_ENDIAN); // default is BIG_ENDIAN, you can change it to LITTLE_ENDIAN.
bb.put(0);
bb.put(new Buffer([0, 1, 2]));
bb.put(new Buffer([255, 255, 255, 255]), 10, 3);
bb.put(21, 100);

bb.putChar('a');
bb.putChar(10, 'b');

bb.putInt(1024);
bb.putInt(-100);

bb.putFloat(100.9);

bb.putLong(10000100009099);
bb.putLong('1152921504606847000');

bb.putShort(65535);
bb.putShort(-50000);

bb.putDouble(99.99999);

// wrap for read
var rb = ByteBuffer.wrap(new Buffer(100));
rb.getInt();
rb.getLong();
rb.getChar();
rb.get();
rb.getDouble();
rb.getFloat();
```

## Benchmark

```bash
$ node benchmark.js
put()       x 12,028,872 ops/sec ±3.87% (87 runs sampled)
putChar()   x 27,884,212 ops/sec ±1.75% (94 runs sampled)
putShort()  x 1,924,297 ops/sec ±1.94% (96 runs sampled)
putInt()    x 1,949,486 ops/sec ±0.59% (99 runs sampled)
putFloat()  x 1,633,070 ops/sec ±1.14% (96 runs sampled)
putDouble() x 1,138,782 ops/sec ±2.12% (94 runs sampled)
putLong()   x 1,279,507 ops/sec ±2.40% (92 runs sampled)
[Wed Nov 13 2013 17:01:50 GMT+0800 (CST)] Fastest is "putChar()  "
```

## `Number` methods

```
putShort / putInt16
putUInt16
putInt / putInt32
putUInt / putUInt32
putInt64
putFloat
putDouble


getShort / getInt16
getUInt16
getInt / getInt32
getUInt / getUInt32
getInt64
getFloat
getDouble
```

## `String` methods

Java String format: `| length (4 bytes int) | string bytes |`

C String format: `| length + 1 (4 bytes int) | string bytes | \0 |`

Row String format: `string bytes`

### `putString()` and `putCString()` and `putRawString()`

```js
bb.putString('foo');
bb.putString(new Buffer('foo'));

bb.putCString('foo');
bb.putCString(new Buffer('foo'));

bb.putRawString('foo');
```

### `getString()` and `getCString()` and `getRawString(), readRawString()`

```js
bb.getString();
bb.getString(10);

bb.getCString();
bb.getCString(10);

bb.getRawString(0, 10);
bb.readRawString(10);
```

## Authors

```bash
$ git summary

 project  : byte
 repo age : 3 months
 active   : 12 days
 commits  : 30
 files    : 15
 authors  :
    23  fengmk2                 76.7%
     7  dead_horse              23.3%
```

## License

(The MIT License)

Copyright (c) 2013 - 2014 fengmk2 &lt;fengmk2@gmail.com&gt; and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
