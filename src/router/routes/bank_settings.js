export default [
    {
        path: '/bank-settings',
        name: 'bank_settings',
        permission: 'access_bank',
        component: () => import('@/views/administration/bank_settings/index'),
        meta:  {pageTitle: 'Administration',breadcrumb: [{ text: 'Bank' }] }
    },
];