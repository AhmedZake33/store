export default [
  {
    path: '/overview',
    name: 'dashboard',
    component: () => import('@/views/dashboard/index'),
    meta: {
      requiresAuth: true,
      permission: 'admin_system'
    },
  },
]
