import { sign } from 'jsonwebtoken'
import { isAdmin } from '../common/auth'

// JWT private key
const getPublicKey = () => {
  if (process.env.JWT_PUBLIC_KEY === undefined) {
    throw `JWT_PUBLIC_KEY not set in the environment variables!`
  }
  return process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n')
}

const getPrivateKey = () => {
  if (process.env.JWT_PRIVATE_KEY === undefined) {
    throw `JWT_PRIVATE_KEY not set in the environment variables!`
  }
  // There's a weird issue where '\n' is getting escaped with an extra \ during the build
  // So I need to fix it via this.
  return process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n')
}

// Used by server to generate a token
export function generateUserToken(address: string) {
  const role = isAdmin(address) ? 'admin' : 'public'
  const payload = {
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': [role],
      'x-hasura-default-role': role,
    },
  }
  const token = sign(payload, getPrivateKey(), { algorithm: 'RS256' })
  return token
}
