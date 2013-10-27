byte [![Build Status](https://secure.travis-ci.org/fengmk2/byte.png)](http://travis-ci.org/fengmk2/byte) [![Coverage Status](https://coveralls.io/repos/fengmk2/byte/badge.png)](https://coveralls.io/r/fengmk2/byte) [![Build Status](https://drone.io/github.com/fengmk2/byte/status.png)](https://drone.io/github.com/fengmk2/byte/latest)
=======

![logo](https://raw.github.com/fengmk2/byte/master/logo.png)

Input Buffer and Output Buffer, just like Java `[ByteBuffer](http://docs.oracle.com/javase/6/docs/api/java/nio/ByteBuffer.html)`.

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
```

## License 

(The MIT License)

Copyright (c) 2013 fengmk2 &lt;fengmk2@gmail.com&gt;

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
