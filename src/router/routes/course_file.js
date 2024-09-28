export default [
    {
    path: '/courseFile',
    name: 'courseFile',
    component: () =>import ('@/views/quality/courseOffer/components/offerings'),
    meta: { pageTitle: 'courseFile', breadcrumb: [{ to: '/courseFile', text: 'Quality' },{ text: 'my_courses' }] },
    },
    {
        path: '/courseFile/:id',
        name: 'courseFiles',
        component: () =>import ('@/views/quality/courseOffer/show'),
        meta: { pageTitle: 'courseFile',navActiveLink:'courseFile', breadcrumb: [{to: '/courseFile', text: 'Quality'},{ to: '/courseFile', text: 'CourseFiles' }, { text: 'course_offering', active: true }] },
    },
]