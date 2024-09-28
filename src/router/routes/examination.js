export default [
    {
        path: '/exams',
        name: 'exams',
        permission: 'access_exam',
        component: () => import('@/views/examination/exams/index'),
        meta: { pageTitle: 'exams', breadcrumb: [{ text: 'examination' } , { text: 'exams' }] },
    },
    {
        path: '/exams/add/:id?',
        name: 'add_exam',
        permission: 'add_exam',
        component: () => import('@/views/examination/exams/show'),
        meta: { pageTitle: 'Add Exam',navActiveLink:'exams',  breadcrumb: [{ text: 'examination' } , { text: 'exams', to: '/exams', }, { text: 'add', active: true }] },
    },

    {
        path: '/exams/:id?',
        name: 'exam',
        permission: 'show_exam',
        component: () => import('@/views/examination/exams/show'),
        meta: { pageTitle: 'exam',navActiveLink:'exams', breadcrumb: [{ text: 'examination' } , { text: 'exams', to: '/exams'  }, { text: 'exam', active: true }] },
    },
    {
        path: '/exams/edit/:id',
        name: 'edit_exam',
        permission: 'edit_exam',
        component: () => import('@/views/examination/exams/show'),
        meta: { pageTitle: 'exams',navActiveLink:'exams', breadcrumb: [{ text: 'examination' } , { text: 'exams', to: '/exams'  }, { text: 'edit', active: false }, { text: 'exam', active: true }] },

    },
    {
        path: '/exams_schedules',
        name: 'exams_schedules',
        permission: 'access_examSchedule',
        component: () => import('@/views/examination/exams_schedules/index'),
        meta: { pageTitle: 'exams_schedules', breadcrumb: [{ text: 'examination' } , { text: 'exams_schedules' }] },
    },
    {
        path: '/exam_schedule/:id?',
        name: 'exam_schedule',
        permission: 'access_examSchedule',
        component: () => import('@/views/examination/exams_schedules/show'),
        meta: { pageTitle: 'exam_schedule',navActiveLink:'exams_schedules', breadcrumb: [{ text: 'examination' } , { text: 'exam_schedule', to: '/exams_schedules' }, { active: true }] },
    },
    {
        path: '/exams_schedules/add/:id?',
        name: 'add_exam_schedule',
        permission: 'add_exam',
        component: () => import('@/views/examination/exams_schedules/show'),
        meta: { pageTitle: 'add_exam_schedule', navActiveLink:'exams_schedules',breadcrumb: [{ text: 'examination' } , { text: 'exams_schedules', to: '/exams_schedules' }, { text: 'add', active: true }] },
    },
    {
        path: '/exams_schedules/edit/:id?',
        name: 'edit_exam_schedule',
        permission: 'edit_examSchedule',
        component: () => import('@/views/examination/exams_schedules/show'),
        meta: { pageTitle: 'edit_exam_schedule',navActiveLink:'exams_schedules', breadcrumb: [{ text: 'examination' } , { text: 'exams_schedules', to: '/exams_schedules' }, { text: 'edit', active: true }] },
    },
    {
        path: '/offering/exams_schedules/add/:examId?',
        name: 'add_offering_exam_schedule',
        permission: 'add_exam',
        component: () => import('@/views/study/offerings/exams_schedules/edit'),
        meta: { pageTitle: 'add_exam_schedule', breadcrumb: [{ text: 'examination' } , { to: '/exams_schedules', text: 'exams_schedules' }, { text: 'course_offering', active: false }, { text: 'add', active: true }] },
    },
    {
        path: '/offering/exams_schedules/edit',
        name: 'edit_offering_exam_schedule',
        permission: 'edit_exam',
        component: () => import('@/views/study/offerings/exams_schedules/edit'),
        meta: { pageTitle: 'edit_exams_schedules', breadcrumb: [{ text: 'examination' } , { to: '/exams_schedules', text: 'exams_schedules' }, { text: 'course_offering', active: false }, { text: 'edit', active: true }] },
    },
    {
        path: '/exams_delivery',
        name: 'exams_delivery',
        component: () => import('@/views/examination/exams_delivery/index'),
        meta: { pageTitle: 'exams_delivery', breadcrumb: [{ text: 'examination' } , { text: 'exams_delivery' }] },
    },
    {
        path: '/exams_absences',
        name: 'exams_absences',
        permission: 'access_examAbsence',
        component: () => import('@/views/examination/exams_absences/index'),
        meta: { pageTitle: 'exams_absences', breadcrumb: [{ text: 'examination' } , { text: 'exams_absences' }] },
    },
    {
        path: '/exams_barcodes',
        name: 'exams_barcodes',
        component: () => import('@/views/examination/exams_barcodes/index'),
        meta: { pageTitle: 'exams_barcodes', breadcrumb: [{ text: 'examination' } , { text: 'exams_barcodes' }] },
    },


    {
        path: '/papers_types',
        name: 'papers_types',
        permission: 'access_examPapersType',
        component: () => import('@/views/examination/papers_types/index'),
        meta: { pageTitle: 'papers_types', breadcrumb: [{ text: 'examination' } , { text: 'papers_types' }] },
    },
    {
        path: '/papers_types/add/:id?',
        name: 'add_papers_type',
        permission: 'add_examSchedule',
        component: () => import('@/views/examination/papers_types/show'),
        meta: { pageTitle: 'add_papers_type',navActiveLink:'papers_types',  breadcrumb: [{ text: 'examination' } , { text: 'papers_types', to: '/papers_types', }, { text: 'add', active: true }] },
    },
    {
        path: '/papers_types/:id?',
        name: 'papers_type',
        permission: 'show_examPapersType',
        component: () => import('@/views/examination/papers_types/show'),
        meta: { pageTitle: 'papers_type',navActiveLink:'papers_types', breadcrumb: [{ text: 'examination' } , { text: 'papers_types', to: '/papers_types'  }, { text: 'papers_type', active: true }] },
    },
    {
        path: '/papers_types/edit/:id',
        name: 'edit_papers_type',
        permission: 'edit_examPapersType',
        component: () => import('@/views/examination/papers_types/show'),
        meta: { pageTitle: 'edit_papers_type',navActiveLink:'papers_types', breadcrumb: [{ text: 'examination' } , { text: 'papers_types', to: '/papers_types'  }, { text: 'edit', active: false }, { text: 'papers_type', active: true }] },

    },
    {
        path: '/exams_punishments',
        name: 'exams_punishments',
        permission: 'access_examPunishment',
        component: () => import('@/views/examination/exams_punishments/index'),
        meta: { pageTitle: 'exams_punishments', breadcrumb: [{ text: 'examination' } , { text: 'exams_punishments' }] },
    },

]
