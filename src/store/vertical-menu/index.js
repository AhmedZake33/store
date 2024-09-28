import { $themeConfig } from '@themeConfig'

export default {
  namespaced: true,
  state: {
    isVerticalMenuCollapsed: $themeConfig.layout.menu.isCollapsed,
    use_cookie: false,
  },
  getters: {},
  mutations: {
    UPDATE_VERTICAL_MENU_COLLAPSED(state, val) {
      state.isVerticalMenuCollapsed = val
      localStorage.setItem('verticalMenu', JSON.stringify(val));
    },
    UPDATE_USE_COOKIE(state, val) {
      state.use_cookie = val
      localStorage.setItem('use_cookie', JSON.stringify(val));
    },
    initialiseVars(state) {
      if (localStorage.getItem('verticalMenu')) {
        state.isVerticalMenuCollapsed = JSON.parse(localStorage.verticalMenu)
      } else {
        state.isVerticalMenuCollapsed = false
      }
      if (localStorage.getItem('use_cookie')) {
        state.use_cookie = JSON.parse(localStorage.use_cookie)
      }
    }
  },
  actions: {},
}
