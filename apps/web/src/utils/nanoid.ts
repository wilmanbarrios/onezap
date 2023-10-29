import { getEnv } from '@/env'
import { customAlphabet } from 'nanoid'

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz'
const length = getEnv().NANOID_HASH_LENGTH

const nanoid = customAlphabet(alphabet, length)

export function generatePublicId() {
  return nanoid()
}
