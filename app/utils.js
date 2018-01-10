'use strict';

export function buffer2hex(buf) {
  return Array.prototype.map.call(new Uint8Array(buf), x => (`00${x.toString(16)}`).slice(-2)).join('');
}

export function toXorArr(a, b) {
  const xorRes = []
  a = new Uint8Array(a)
  b = new Uint8Array(b)

  for (let i = 0; i < a.length; i++) {
    xorRes.push(a[i] ^ b[i])
  }

  return xorRes
}
