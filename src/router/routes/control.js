export default [
  {
    path: '/control/offerings',
    name: 'control_offerings',
    component: () =>
      import('@/views/control/course_offerings/index'),
    meta: { pageTitle: 'offerings', breadcrumb: [{ text: 'control' }, { text: 'course_offerings' }] },
  },

  {
    path: '/control/students',
    name: 'control_students',
    component: () =>
      import('@/views/control/students/index'),
    meta: { pageTitle: 'students', breadcrumb: [{ text: 'control' }, { text: 'students' }] },
  },
  {
    path: '/control/students/:student_id/:term_id',
    name: 'students_view',
    component: () =>
      import('@/views/control/students/studentDataView'),
    meta: { pageTitle: 'control_students_view', breadcrumb: [{ text: 'control' }, { to: '/control/students', text: 'students' }, { text: ' student_control', active: true }] },
  },
  {
    path: '/control/results',
    name: 'control_results',
    component: () =>
      import('@/views/control/control_results/index'),
    meta: { pageTitle: 'results', breadcrumb: [{ text: 'control' }, { text: 'control_results' }] },
  },
  {
    path: '/control/grades_recheck',
    name: 'grades_recheck',
    component: () =>
      import('@/views/control/grades_recheck/index'),
    meta: { pageTitle: 'grades_recheck', breadcrumb: [{ text: 'control' }, { text: 'grades_recheck' }] },
  },

  {
    path: '/control/grades_recheck/show/:id',
    name: 'show_grades_recheck',
    component: () =>
      import('@/views/control/grades_recheck/show'),
    meta: { pageTitle: 'grades_recheck', breadcrumb: [{ text: 'control' }, {to: '/control/grades_recheck', text: 'grades_recheck' }] },
  },

  {
    path: '/control/grades_recheck/edit/:id',
    name: 'edit_grades_recheck',
    component: () =>
      import('@/views/control/grades_recheck/show'),
    meta: { pageTitle: 'grades_recheck', breadcrumb: [{ text: 'control' }, {to: '/control/grades_recheck', text: 'grades_recheck' }] },
  },

]
