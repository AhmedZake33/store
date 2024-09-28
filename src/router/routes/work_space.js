export default [
    {
        path: '/workspace/my_offerings',
        name: 'my_courses_workspace',
        component: () => import ('@/views/MyWorkSpace/course/index'),
        meta: { pageTitle: 'Courses', breadcrumb: [{ text: 'my_courses_workspace' }] },
    },

    {
        path: '/my_theses',
        name: 'my_theses',
        component: () => import('@/views/research/theses/index'),
        meta: {pageTitle: 'theses', breadcrumb: [{text: 'theses'}]},
    },
]