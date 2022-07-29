import cookie from 'js-cookie'
import jwtDecode from 'jwt-decode'

export const AUTH_TOKEN = 'token'

// Used by client to store the token
export function storeUserToken(token: string) {
  return cookie.set(AUTH_TOKEN, token, { expires: 1 })
}

// Used by client to store the token
export function getUserToken() {
  return cookie.get(AUTH_TOKEN)
}

// Used by client to remove the token
export function removeUserToken() {
  return cookie.remove(AUTH_TOKEN)
}

export function decodeUserToken(token: string) {
  return jwtDecode(token)
}
