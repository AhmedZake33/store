import { getAuth } from '../../utils/auth';

export default [{
        path: '/offerings',
        name: 'offerings',
        component: () =>
            import ('@/views/study/offerings/index'),
        meta: { pageTitle: 'offerings', breadcrumb: [{ text: 'study'} , { text: 'course_offerings' }] },
    },
    {
        path: '/offering/:id',
        name: 'offering',
        component: () =>
            import ('@/views/study/offerings/show'),
        meta: { pageTitle: 'offering',navActiveLink:'offerings', breadcrumb: [{ text: 'study'} , { to: getAuth()&&JSON.parse(getAuth()).type.type == 1 ? '/workspace/my_offerings': '/offerings', text: 'course_offerings' }, { text: 'course_offering', active: true }] },
    },
    {
        path: '/offerings/add/',
        name: 'add_offering',
        component: () =>
            import ('@/views/study/offerings/add'),
        meta: { pageTitle: 'offering',navActiveLink:'offerings',  breadcrumb: [{ text: 'study'} , { to: '/offerings', text: 'course_offerings' }, { text: 'add_course_offering', active: true }] },
    },
    {
        path: '/offering/edit/:id',
        name: 'edit_offering',
        component: () =>
            import ('@/views/study/offerings/edit'),
        meta: { pageTitle: 'offering',navActiveLink:'offerings',  breadcrumb: [{ text: 'study'} , { to: '/offerings', text: 'course_offerings' }, { text: 'edit_course_offering', active: true }] },
    },
    {
        path: '/offerings/import_grades/:id',
        name: 'import_grades',
        component: () =>
            import ('@/views/study/offerings/reviewImport'),
        meta: { pageTitle: 'import_grades',navActiveLink:'offerings',  breadcrumb: [{ text: 'study'} , { to: '/offerings', text: 'course_offerings' }, { text: 'review_grades', active: true }] },
    },
    {
        path: '/terms',
        name: 'terms',
        component: () =>
            import ('@/views/study/terms/index'),
        meta: { pageTitle: 'terms',navActiveLink:'terms',  breadcrumb: [{ text: 'terms' }] },
    },

    {
        path: '/term/:id',
        name: 'term',
        component: () =>
            import ('@/views/study/terms/show'),
        meta: { pageTitle: 'term', navActiveLink:'terms',breadcrumb: [{ to: '/terms', text: 'terms' }, { text: 'term', active: true }] },
    },

    {
        path: '/terms/edit/:id?',
        name: 'edit_term',
        component: () =>
            import ('@/views/study/terms/edit'),
        meta: { pageTitle: 'terms',navActiveLink:'terms', breadcrumb: [{ to: '/terms', text: 'terms' }, { text: 'term' }] },
    },
    {
        path: '/sections',
        name: 'sections',
        component: () =>
            import ('@/views/study/sections/index'),
        meta: { pageTitle: 'sections', breadcrumb: [{ text: 'study'} , { text: 'sections' }] },
    },
    {
        path: '/section/add',
        name: 'add_section',
        component: () =>
            import ('@/views/study/sections/add'),
        meta: { pageTitle: 'section',navActiveLink:'sections', breadcrumb: [{ text: 'study'} , { to: '/sections', text: 'sections' , active:true }, { text: 'Add Section', active: true }] },
    },
    {
        path: '/sections/multi',
        name: 'multi_seactions',
        component: () =>
            import ('@/views/study/sections/multi'),
        meta: { pageTitle: 'offerings',navActiveLink:'sections', breadcrumb: [{ text: 'study'} , { to: '/sections', text: 'sections' , active:true }, { text: 'Add Multiple Sections', active: true }] },
    },
    {
        path: '/section/:id',
        name: 'section',
        component: () =>
            import ('@/views/study/sections/show'),
        meta: { pageTitle: 'section',navActiveLink:'sections', breadcrumb: [{ text: 'study'} , { to: '/sections', text: 'sections' }, { text: 'section', active: true }] },
    },
    {
        path: '/section/edit/:id',
        name: 'edit_section',
        component: () =>
            import ('@/views/study/sections/edit'),
        meta: { pageTitle: 'section',navActiveLink:'sections', breadcrumb: [{ text: 'study'} , { to: '/sections', text: 'sections'  }, { text: 'Edit Section'}] },
    },
    {
        path: '/registrations',
        name: 'registrations',
        component: () =>
            import ('@/views/study/studies/index'),
        meta: { pageTitle: 'registrations', breadcrumb: [{ text: 'study'} , { text: 'Registrations' }] },
    },
    {
        path: '/excuses',
        name: 'excuses',
        component: () => import('@/views/study/excuses/index'),
        meta: {pageTitle: 'Excuses', breadcrumb: [{ text: 'study'} ,  {to: '/excuses', text: 'Excuses'}]},
    },
    {
        path: '/excuses/add',
        name: 'add_excuse',
        component: () => import('@/views/study/excuses/show'),
        meta: { pageTitle: 'Add Excuse', breadcrumb: [{ to: '/excuses', text: 'excuses' }, { text: 'add', active: true }] },
    },
    {
        path: '/excuses/:id',
        name: 'excuse-show',
        component: () => import('@/views/study/excuses/show'),
        meta: {pageTitle: 'Excuse',navActiveLink:'excuses', breadcrumb: [{ text: 'study'} ,  {to: '/excuses', text: 'Excuses'}, {text: 'Excuse', active: true}]},
    },
    {
        path: '/excuses/edit/:id',
        name: 'edit_excuse',
        component: () => import('@/views/study/excuses/show'),
        meta: { pageTitle: 'Edit Excuse',navActiveLink:'excuses', breadcrumb: [{ text: 'study'} ,  { to: '/excuses', text: 'excuses' }, { text: 'edit', active: false }, { text: 'excuse', active: true }] },

    },

    {
        path: '/offerings/my_schedule/:id?',
        name: 'mySchedule',
        component: () =>
            import ('@/views/study/schedule/instructors/scheduling/calendar/Calendar'),
        meta: { pageTitle: 'schedule',navActiveLink:'offerings', breadcrumb: [{ text: 'study'} ,  { text: 'my_schedule' }] },
    },
    {
        path: '/schedules',
        name: 'schedules',
        component: () =>
            import ('@/views/study/schedule/calendars'),
        meta: { pageTitle: 'schedules',navActiveLink:'schedules', breadcrumb: [{ text: 'study'} ,  { to: '/schedules', text: 'schedules' }] },
    },
    {
        path: '/location/schedule/:id',
        name: 'location-schedule',
        component: () =>
            import ('@/views/study/schedule/locations/scheduling/calendar/Calendar'),
        meta: { pageTitle: 'schedule',navActiveLink:'schedules',  breadcrumb: [{ text: 'study'} ,  { to: '/schedules', text: 'schedules' }, {text: 'locations', active: true}] },
    },
    {
        path: '/instructor/schedule/:id',
        name: 'instructor-schedule',
        component: () =>
            import ('@/views/study/schedule/instructors/scheduling/calendar/Calendar'),
        meta: { pageTitle: 'schedule',navActiveLink:'schedules',  breadcrumb: [{ text: 'study'} ,  { to: '/schedules', text: 'schedules' }, {text: 'Instructors', active: true}] },
    },
    {
        path: '/student/schedule/:id',
        name: 'student-schedule',
        component: () =>
            import ('@/views/study/schedule/students/scheduling/calendar/Calendar'),
        meta: { pageTitle: 'schedule',navActiveLink:'schedules',  breadcrumb: [{ text: 'study'} , { to: '/schedules', text: 'schedules' }, {text: 'students', active: true}] },
    },
    {
        path: '/offerings/schedule/:id',
        name: 'offering-schedule',
        component: () =>
            import ('@/views/study/schedule/offerings/scheduling/calendar/Calendar'),
        meta: { pageTitle: 'schedule',navActiveLink:'schedules',  breadcrumb: [{ text: 'study'} , { to: '/offerings', text: 'course_offerings' }, {text: 'schedule', active: true}] },
    },
    {
        path: '/academic_advisors',
        name: 'academic_advisors',
        component: () =>
            import ('@/views/study/academic_advisors/index'),
        meta: { pageTitle: 'Academic Advisors', breadcrumb: [{ text: 'study'} , { to: '/academic_advisors', text: 'Academic Advisors' }] },
    },
    {
        path: '/advised_students',
        name: 'advised_students',
        component: () =>
            import ('@/views/study/advised_students/index'),
            meta: { pageTitle: 'Advised Students', breadcrumb: [{ text: 'study'} , { to: '/advised_students', text: 'Advised Students' }] },
    },
    //barcode page
    {
        path: '/control/offerings/barcode/:id', //offering id
        name: 'barcode',
        component: () =>
            import ('@/views/study/offerings/barcode'),
        meta: { pageTitle: 'barcode',navActiveLink:'barcode',  breadcrumb: [{ text: 'study'} , { to: '/offerings', text: 'course_offerings' }, { text: 'barcode', active: true }] },
    },
]
