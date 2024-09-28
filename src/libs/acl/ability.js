import store from '@/store'
export default function Permission(permission) {
  return true
}
// export default function Permission(permission) {
//   if (store.getters['roles/authUserRolesPermissionsName'].length > 0 || store.getters['roles/authUserPermissionsName'].length > 0) {
//     return store.getters['roles/authUserRolesPermissionsName'].includes(permission) || store.getters['roles/authUserPermissionsName'].includes(permission)
//   } else {
//     return true
//   }
// }