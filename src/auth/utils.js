import Cookies from 'js-cookie'
import store from '@/store/index'

/**
 * Return if user is logged in
 * This is completely up to you and how you want to store the token in your frontend application
 * e.g. If you are using cookies to store the application please update this function
 */
// eslint-disable-next-line arrow-body-style
export const isUserLoggedIn = () => {
  return isLogged() && getToken() && getAuth()
}

export const getUserData = () => getAuth()

/**
 * This function is used for demo purpose route navigation
 * In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 * Please note role field is just for showing purpose it's not used by anything in frontend
 * We are checking role just for ease
 * NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  // if (userRole === 'admin') return { name: 'dashboard-ecommerce' }
  // if (userRole === 'client') return { name: 'access-control' }
  if (userRole === 'student') return { name: 'student-profile' }
  return { name:'user-profile' }
  //return { name: 'auth-login' }
}

const TokenKey = 'isLogged'
const Token = 'token'
const User = 'user'

export function isLogged() {
  return Cookies.get(TokenKey) === '1'
}

export function setLogged(isLogged) {
  return Cookies.set(TokenKey, isLogged)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setToken(token) {
  return Cookies.set(Token, token)
}

export function getToken() {
  return Cookies.get(Token)
}

export function deleteToken() {
  return Cookies.remove(Token)
}

export function Auth(user) {
  return Cookies.set(User, user)
}

export function getAuth() {
  return JSON.parse(Cookies.get(User))
}

export function removeAuth() {
  return Cookies.remove(User)
}

export function notHasPermissions() {
  return Cookies.get(TokenKey) === '2'
}

export function resetPermission() {
  store.commit('roles/SET_AUTH_USER_PERMISSIONS', [])
  store.commit('roles/SET_AUTH_USER_ROLES_PERMISSIONS', [])
}