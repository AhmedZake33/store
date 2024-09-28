import permission from './ability'

export const canNavigate = to => to.matched.some(route => permission(route.meta.permission) || route.meta.public)

export const _ = undefined
