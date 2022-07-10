const circomlibjs = require('circomlibjs')
import * as crypto from 'crypto'

export function pedersenHash(nullifier: BigInt): BigInt {
  return pedersenHashBuff(toBufferLE(nullifier as any, 31))
}

export function pedersenHashConcat(nullifier: BigInt, secret: BigInt): BigInt {
  let nullBuff = toBufferLE(nullifier as any, 31)
  let secBuff = toBufferLE(secret as any, 31)
  let combinedBuffer = Buffer.concat([nullBuff, secBuff])
  return pedersenHashBuff(combinedBuffer)
}

export function toHex(number: BigInt, length = 32) {
  const str: string = number.toString(16)
  return '0x' + str.padStart(length * 2, '0')
}

export function randomBigInt(nBytes: number): BigInt {
  return toBigIntLE(crypto.randomBytes(nBytes))
}

export function toBigIntLE(buff: Buffer) {
  const reversed = Buffer.from(buff)
  reversed.reverse()
  const hex = reversed.toString('hex')
  if (hex.length === 0) {
    return BigInt(0)
  }
  return BigInt(`0x${hex}`)
}

function pedersenHashBuff(buff: Buffer): BigInt {
  let point = circomlibjs.pedersenHash.hash(buff)
  return circomlibjs.babyjub.unpackPoint(point)[0]
}

function toBufferLE(bi: BigInt, width: number): Buffer {
  const hex = bi.toString(16)
  const buffer = Buffer.from(hex.padStart(width * 2, '0').slice(0, width * 2), 'hex')
  buffer.reverse()
  return buffer
}
