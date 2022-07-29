import { sign } from 'jsonwebtoken'

// JWT private key
const getPublicKey = () => {
  if (process.env.JWT_PUBLIC_KEY === undefined) {
    throw `JWT_PUBLIC_KEY not set in the environment variables!`
  }
  return process.env.JWT_PUBLIC_KEY.replace(/\\n/g, '\n')
  // return process.env.JWT_PUBLIC_KEY
}

const getPrivateKey = () => {
  if (process.env.JWT_PRIVATE_KEY === undefined) {
    throw `JWT_PRIVATE_KEY not set in the environment variables!`
  }
  // There's a weird issue where '\n' is getting escaped with an extra \ during the build
  // So I need to fix it via this.
  return process.env.JWT_PRIVATE_KEY.replace(/\\n/g, '\n')
  // return process.env.JWT_PRIVATE_KEY
}

const SRIKAR_ADMIN = '0x56e47337E6E60E08726aA9a682dCBd72312c5d32'
const BOWEN_ADMIN = '0x46Dc90D24dD1577225d42Be88351bc1C14fF980B'
const JOHNNY_ADMIN = '0xf725a0353dbB6aAd2a4692D49DDa0bE241f45fD0'

const ADMIN_USERS = [SRIKAR_ADMIN, BOWEN_ADMIN, JOHNNY_ADMIN]

export function isAdmin(address: string) {
  return ADMIN_USERS.includes(address)
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
