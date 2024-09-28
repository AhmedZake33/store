import Vue from 'vue'
import store from '../store/index'



Vue.directive('hasPermissions', (el, binding) => {
  if (!store.getters['roles/userRolesPermissionsName'].includes(binding.value)) {
    el.style.display = 'none'
  }
})
