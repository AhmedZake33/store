export default [
  {
    title: 'Dashboards',
    icon: 'HomeIcon',
    tag: '2',
    tagVariant: 'light-warning',
    children: [
      {
        title: 'Categories',
        children: [
          {
            title: 'Categories',
            route: 'category-list',
          },
          {
            title: 'Add',
            route: 'category-add',
          }
        ],
      },
      {
        title: 'Products',
        route: 'dashboard-analytics',
      },
    ],
  },
]
