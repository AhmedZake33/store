import { ref, computed } from '@vue/composition-api'
import store from '@/store'

export default function useVerticalNavMenu(props) {
  // ------------------------------------------------
  // isVerticalMenuCollapsed
  // ------------------------------------------------
  const isVerticalMenuCollapsed = computed({
    get: () => {
      return store.state.verticalMenu.isVerticalMenuCollapsed
  },
    set: val => {
      store.commit('verticalMenu/UPDATE_VERTICAL_MENU_COLLAPSED', val)
    },
  })

  // ------------------------------------------------
  // collapseTogglerIcon
  // ------------------------------------------------
  const collapseTogglerIcon = computed(() => {
    if (props.isVerticalMenuActive) {
      return isVerticalMenuCollapsed.value ? 'unpinned' : 'pinned'
    }
    return 'close'
  })

  const isMouseHovered = ref(false)

  const updateMouseHovered = val => {
    isMouseHovered.value = val
  }

  const toggleCollapsed = () => {
    let data = localStorage.getItem('verticalMenu')
    if(data){
      localStorage.setItem('verticalMenu',false)
    }else{
      localStorage.setItem('verticalMenu',true)
    }
    isVerticalMenuCollapsed.value = !isVerticalMenuCollapsed.value
  }

  return {
    isMouseHovered,
    isVerticalMenuCollapsed,
    collapseTogglerIcon,
    toggleCollapsed,
    updateMouseHovered,
  }
}
