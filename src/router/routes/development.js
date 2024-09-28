export default [
    {
    path: '/development',
    name: 'development',
    component: () =>import ('@/views/development/development'),
    meta: { pageTitle: 'development', breadcrumb: [{ to: '/development', text: 'Development' },{ text: 'development' }] },
    }
]