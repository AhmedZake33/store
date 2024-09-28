export default [
  {
    path:"/emtyaz/add_course/:bylaw?/:faculty?",
    name:"emtyaz_course_add",
    component: () => import('@/views/emtyaz/courses/show'),
    meta: { pageTitle: 'Medical Internship',navActiveLink:'Medical Internship', breadcrumb: [ {text:'Medical Internship'}, { text: 'courses' }, { text: 'course', active: true }] },
  },
  {
    path:"/emtyaz/course/show/:id/:bylaw?",
    name:"emtyaz_course_show",
    component: () => import('@/views/emtyaz/courses/show'),
    meta: { pageTitle: 'Medical Internship',navActiveLink:'Medical Internship', breadcrumb: [{text:'Medical Internship'}, { text: 'courses' }, { text: 'course', active: true }] },
  },
  {
    path:"/emtyaz/training",
    name:"emtyaz_training",
    component: () => import('@/views/emtyaz/training/index'),
    meta: { pageTitle: 'Medical Internship',navActiveLink:'Medical Internship', breadcrumb: [{text:'Medical Internship'}, { text: 'Trainings', active: true }] },
  },
  {
    path: '/emtyaz/registration',
    name: 'emtyaz_registration',
    component: () => import('@/views/emtyaz/training/registration'),
    meta: { pageTitle: 'Medical Internship',navActiveLink:'Medical Internship', breadcrumb: [{text:'Medical Internship'}, { text: 'Registrations', active: true }] },
  },
  {
    path: '/emtyaz/registration/:id',
    name: 'emtyaz_advising_registration',
    component: () =>
      import('@/views/emtyaz/training/students/RegistrationStudent'),
    // meta: { pageTitle: 'offering_registration',navActiveLink:'advising', breadcrumb: [{ text: 'study'} , { to: '/advising', text: 'Advising' }, { text: 'Registration', active: true }] },
  },
  {
    path: '/emtyaz/offerings/:id',
    name: 'emtyaz_offerings',
    component: () => import('@/views/emtyaz/offerings/show'),
    meta: { pageTitle: 'Medical Internship',navActiveLink:'Medical Internship', breadcrumb: [{ text: 'Medical Internship'} , { text: 'Medical Internship Offferings' }] },
  },
  {
    path: '/emtyaz/training/:id',
    name: 'emtyaz_training_show',
    component: () => import('@/views/emtyaz/training/show'),
    meta: {
      pageTitle: 'Emtyaz',
      navActiveLink: 'emtyaz',
      breadcrumb: [{ text: 'Emtyaz' }, { text: 'Trainings', active: true }],
    },
  },
];
