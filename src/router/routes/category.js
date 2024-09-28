export default [
    {
      path: '/category/add',
      name: 'category-add',
      component: () => import('@/views/category/add.vue')
    },
    {
        path: '/category/list',
        name: 'category-list',
        component: () => import('@/views/category/list.vue')
      }
  ]
  