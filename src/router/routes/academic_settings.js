export default [
  {
    path: '/settings/programs/edit/:id',
    name: 'program_edit',
    component: () => import('@/views/academic_settings/programs/edit'),
    meta: { pageTitle: 'edit',navActiveLink:'programs', breadcrumb: [{text: 'academic_settings'},{ to: '/settings/Programs', text: 'programs' }, { text: 'program', active: true }] },
  },
  {
    path: '/settings/programs/show/add/:bylaw_id?/:faculty_id?/:faculty?',
    name: 'program_add',
    component: () => import('@/views/academic_settings/programs/show'),
    meta: { pageTitle: 'edit',navActiveLink:'programs', breadcrumb: [{text: 'academic_settings'},{ to: '/settings/Programs', text: 'programs' }, { text: 'add', active: true }] },
  },
  {
    path: '/settings/programs',
    name: 'programs',
    component: () => import('@/views/academic_settings/programs/index'),
    meta: { pageTitle: 'programs',navActiveLink:'programs', breadcrumb: [{text: 'academic_settings'}, { text: 'Programs' }] },
  },
  {
    path: '/programs/:id',
    name: 'program',
    component: () => import('@/views/academic_settings/programs/show'),
    meta: { pageTitle: 'programs',navActiveLink:'programs', breadcrumb: [{text: 'academic_settings'}, { to: '/settings/programs', text: 'Programs' }, { text: 'program', active: true }] },
  },

  {
    path: '/departments',
    name: 'departments',
    component: () => import('@/views/academic_settings/departments/index'),
    meta: { pageTitle: 'departments', navActiveLink:'departments', breadcrumb: [{text: 'academic_settings'}, { text: 'Departments' }] },
  },
  {
    path: '/departments/:id',
    name: 'department',
    component: () => import('@/views/academic_settings/departments/show'),
    meta: { pageTitle: 'department',navActiveLink:'departments', breadcrumb: [{text: 'academic_settings'}, { to: '/departments', text: 'departments' }, { text: 'department', active: true }] },
  },
  {
    path: '/settings/faculties/:page?',
    name: 'faculties',
    component: () => import('@/views/academic_settings/faculties/index'),
    meta: { pageTitle: 'faculties', breadcrumb: [{text: 'academic_settings'} , { text: 'Faculties', active: true }] },
  },
  {
    path: '/settings/faculties/show/add',
    name: 'faculty_add',
    component: () => import('@/views/academic_settings/faculties/show'),
    meta: { pageTitle: 'Add Faculty',navActiveLink:'faculties', breadcrumb: [{text: 'academic_settings'}, { text: 'Faculties', to: '/settings/faculties' }, { text: 'add', active: true }] },
  },
  {
    path: '/settings/faculties/edit/:id',
    name: 'faculty_edit',
    component: () => import('@/views/academic_settings/faculties/edit'),
    meta: { pageTitle: 'Edit Faculty',navActiveLink:'faculties', breadcrumb: [{text: 'academic_settings'}, { text: 'Faculties', to: '/settings/faculties' }, { text: 'edit', active: false }, { text: 'faculty', active: true }] },
  },
  {
    path: '/faculties/:id',
    name: 'faculty',
    component: () => import('@/views/academic_settings/faculties/show'),
    meta: { pageTitle: 'faculty',navActiveLink:'faculties', breadcrumb: [{text: 'academic_settings'}, { text: 'Faculties', to: '/settings/faculties' }, { text: 'faculty', active: true }] },
  },
  {
    path: '/settings/bylaws',
    name: 'bylaws',
    component: () => import('@/views/academic_settings/bylaws/index'),
    meta: { pageTitle: 'bylaws',navActiveLink:'bylaws', breadcrumb: [{text: 'academic_settings'}, { text: 'Bylaws', active: true }] },
  },
  {
    path: '/bylaws/:id',
    name: 'bylaw',
    component: () => import('@/views/academic_settings/bylaws/show'),
    meta: { pageTitle: 'bylaws',navActiveLink:'bylaws', breadcrumb: [{text: 'academic_settings'}, { text: 'Bylaws', to: '/settings/bylaws' }, { text: 'bylaw', active: true }] },
  },
  {
    path: '/settings/bylaws/show/add/:faculty_id?',
    name: 'bylaw_add',
    component: () => import('@/views/academic_settings/bylaws/show'),
    meta: { pageTitle: 'edit',navActiveLink:'bylaws', breadcrumb: [{text: 'academic_settings'}, { text: 'Bylaws', to: '/settings/bylaws' }, { text: 'add', active: true }] },
  },
  {
    path: '/settings/bylaws/edit/:id',
    name: 'bylaw_edit',
    component: () => import('@/views/academic_settings/bylaws/edit'),
    meta: { pageTitle: 'edit',navActiveLink:'bylaws', breadcrumb: [{text: 'academic_settings'}, { text: 'Bylaws', to: '/settings/bylaws' }, { text: 'edit', active: false }, { text: 'bylaw', active: true }] },
  },
  {
    path: '/settings/departments/edit/:id',
    name: 'department_edit',
    component: () => import('@/views/academic_settings/departments/edit'),
    meta: { pageTitle: 'edit',navActiveLink:'departments', breadcrumb: [{text: 'academic_settings'}, { to: '/Departments', text: 'departments' }, { text: 'edit', active: false }, { text: 'department', active: true }] },
  },
  {
    path: '/settings/departments/show/add/:faculty_id?',
    name: 'department_add',
    component: () => import('@/views/academic_settings/departments/show'),
    meta: { pageTitle: 'edit',navActiveLink:'departments', breadcrumb: [{text: 'academic_settings'}, { to: '/Departments', text: 'departments' }, { text: 'add', active: true }] },
  },
  {
    path: '/settings/courses/edit/:id',
    name: 'course_edit',
    component: () => import('@/views/academic_settings/courses/edit'),
    meta: { pageTitle: 'edit',navActiveLink:'courses', breadcrumb: [{text: 'academic_settings'}, { text: 'courses', to: '/settings/courses' }, { text: 'course', active: true }] },
  },
  {
    path: '/settings/courses/show/add/:bylaw_id?/:faculty_id?/:department_id?',
    name: 'course_add',
    component: () => import('@/views/academic_settings/courses/show'),
    meta: { pageTitle: 'edit',navActiveLink:'courses', breadcrumb: [{text: 'academic_settings'}, { text: 'courses', to: '/settings/courses' }, { text: 'add', active: true }] },
  },

  {
    path: '/settings/courses',
    name: 'courses',
    component: () => import('@/views/academic_settings/courses/index'),
    meta: { pageTitle: 'courses', breadcrumb: [{text: 'academic_settings'}, { text: 'courses', active: true }] },
  },
  {
    path: '/settings/courses/:id',
    name: 'course',
    component: () => import('@/views/academic_settings/courses/show'),
    meta: { pageTitle: 'courses',navActiveLink:'courses', breadcrumb: [{text: 'academic_settings'}, { text: 'courses', to: '/settings/courses' }, { text: 'course', active: true }] },
  },
  
]
