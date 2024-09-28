export default [
  // {
  //   path: '/service/settings/certificates',
  //   name: 'certificates_settings',
  //   component: () => import('@/views/services_settings/certificates/certificates'),
  //   meta: {pageTitle: 'certificates_settings', breadcrumb: [{text: 'certificates_settings',active:true}]},
  // },
  // {
  //   path: '/service/settings/certificates/edit/:year_id/:id',
  //   name: 'certificates_settings_edit',
  //   component: () => import('@/views/services_settings/certificates/edit'),
  //   meta: {pageTitle: 'certificates_settings', breadcrumb: [{to: '/service/settings/certificates', text: 'certificates_settings'},{text:'certificate_settings',active:true}]},
  // },
  {
    path: '/timeline',
    name: 'timeline',
    component: () => import('@/views/TimeLine'),
    meta: {pageTitle: 'certificates_settings', breadcrumb: [{to: '/service/settings/certificates', text: 'certificates_settings'},{text:'certificate_settings',active:true}]},
  }
]
