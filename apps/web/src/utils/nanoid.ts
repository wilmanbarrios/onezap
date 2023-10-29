import { env } from '@/env.mjs'
import { customAlphabet } from 'nanoid'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const length = env.NANOID_HASH_LENGTH

const nanoid = customAlphabet(alphabet, length)

export function generatePublicId() {
  return nanoid()
}
