const circomlibjs = require('circomlibjs')
import crypto from 'crypto-browserify'

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

export async function getFileString(filename: string) {
  let req = await fetch(filename)
  return await req.text()
}

export async function getFileBuffer(filename: string) {
  let req = await fetch(filename)
  return Buffer.from(await req.arrayBuffer())
}
