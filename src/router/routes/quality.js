export default [
  
  {
    path: '/forms',
    name: 'forms',
    component: () => import('@/views/quality/forms/index'),
    meta: { pageTitle: 'forms', breadcrumb: [{ text: 'forms' }] },
  },
  {
    path: '/forms/:id',
    name: 'form',
    permission: 'access_users',
    component: () => import('@/views/quality/forms/show'),
    meta: {
      pageTitle: 'form',
      breadcrumb: [
        { to: '/forms', text: 'forms' },
        { text: 'form', active: true },
      ],
    },
  },

  {
    path: '/faculty_questionnaires',
    name: 'faculty_questionnaires',
    component: () => import('@/views/quality/facultyQuestionnaires/index'),
    meta: { pageTitle: 'faculty_questionnaires', breadcrumb: [{ text: 'faculty_questionnaires' }] },
  },
  {
    path: '/faculty_questionnaires/:id',
    name: 'faculty_questionnaire',
    permission: 'access_users',
    component: () => import('@/views/quality/facultyQuestionnaires/show'),
    meta: {
      pageTitle: 'faculty_questionnaire',
      breadcrumb: [
        { to: '/faculty_questionnaires', text: 'faculty_questionnaire' },
        { text: 'faculty_questionnaire', active: true },
      ],
    },
  },

  {
    path: '/student_questionnaires',
    name: 'student_questionnaires',
    component: () => import('@/views/quality/studentQuestionnaires/index'),
    meta: { pageTitle: 'student_questionnaires', breadcrumb: [{ text: 'student_questionnaires' }] },
  },
  {
    path: '/student_questionnaires/:id',
    name: 'student_questionnaire',
    permission: 'access_users',
    component: () => import('@/views/quality/studentQuestionnaires/show'),
    meta: {
      pageTitle: 'student_questionnaire',
      breadcrumb: [
        { to: '/student_questionnaires', text: 'student_questionnaires' },
        { text: 'student_questionnaire', active: true },
      ],
    },
  },

  {
    path: '/graduate_questionnaires',
    name: 'graduate_questionnaires',
    component: () => import('@/views/quality/graduateQuestionnaires/index'),
    meta: { pageTitle: 'graduate_questionnaires', breadcrumb: [{ text: 'graduate_questionnaires' }] },
  },
  {
    path: '/graduate_questionnaires/:id',
    name: 'graduate_questionnaire',
    permission: 'access_users',
    component: () => import('@/views/quality/graduateQuestionnaires/show'),
    meta: {
      pageTitle: 'graduate_questionnaire',
      breadcrumb: [
        { to: '/graduate_questionnaires', text: 'graduate_questionnaires' },
        { text: 'graduate_questionnaire', active: true },
      ],
    },
  },

  //Questionnaires
  {
    path: '/questionnaires',
    name: 'questionnaires',
    permission: 'access_questionnaire',
    component: () => import('@/views/quality/questionnaires/index'),
    meta: { pageTitle: 'surveys', breadcrumb: [{ text: 'surveys' }] },
  },
  {
    path: '/questionnaires/show/:id',
    name: 'show_questionnaire',
    permission: 'show_questionnaire',
    component: () => import('@/views/quality/questionnaires/show'),
    meta: { pageTitle: 'surveys', breadcrumb: [{ to: '/questionnaires', text: 'surveys' }, {text: 'survey', active: true}] },
  },
  {
    path: '/questionnaires/add',
    name: 'add_questionnaire',
    permission: 'add_questionnaire',
    component: () => import('@/views/quality/questionnaires/show'),
    meta: { pageTitle: 'Add Surveys', breadcrumb: [{ to: '/questionnaires', text: 'surveys' }, {text: 'add', active: true}] },
  },
  {
    path: '/questionnaires/edit/:id',
    name: 'edit_questionnaire',
    permission: 'edit_questionnaire',
    component: () => import('@/views/quality/questionnaires/show'),
    meta: { pageTitle: 'Edit Surveys', breadcrumb: [{ to: '/questionnaires', text: 'surveys' }, {text: 'edit', active: true}] },
  },
  {
    path: '/questionnaires/statistics/show/:id',
    name: 'show_questionnaireStatistics',
    // permission: 'show_questionnaireStats',
    component: () => import('@/views/quality/questionnaires/statistics'),
    meta: { pageTitle: 'statistics', breadcrumb: [{ to: '/questionnaires', text: 'surveys' }, {text: 'Questionnaire Statistics', active: true}] },
  },

  //Questionnaires Types
  {
    path: '/questionnaires_types',
    name: 'questionnaires_types',
    permission: 'access_questionnaireType',
    component: () => import('@/views/quality/questionnaires_types/index'),
    meta: { pageTitle: 'questionnaires_types', breadcrumb: [{ text: 'questionnaires_types' }] },
  },
  {
    path: '/questionnaires_types/show/:id',
    name: 'show_questionnairesTypes',
    permission: 'access_questionnaireType',
    component: () => import('@/views/quality/questionnaires_types/show'),
    meta: { pageTitle: 'questionnaires_types', breadcrumb: [{ to: '/questionnaires_types', text: 'questionnaires_types' }, {text: 'questionnaireType', active: true}] },
  },
  {
    path: '/questionnaires_types/add',
    name: 'add_questionnaireType',
    permission: 'add_questionnaireType',
    component: () => import('@/views/quality/questionnaires_types/show'),
    meta: { pageTitle: 'Add QuestionnairesTypes', breadcrumb: [{ to: '/questionnaires_types', text: 'questionnaires_types' }, {text: 'add', active: true}] },
  },
  {
    path: '/questionnaires_types/edit/:id',
    name: 'edit_questionnaireType',
    permission: 'edit_questionnaireType',
    component: () => import('@/views/quality/questionnaires_types/show'),
    meta: { pageTitle: 'Edit QuestionnairesTypes', breadcrumb: [{ to: '/questionnaires_types', text: 'questionnaires_types' }, {text: 'edit', active: true}] },
  },
  {
    path: '/questionnaire_form/:id',
    name: 'questionnaire_form',
    // permission: 'access_questionnaireType',
    component: () => import('@/views/quality/questionnaires_forms/index'),
    meta: { pageTitle: 'questionnaire_form', breadcrumb: [{ text: 'questionnaire_form' }] },
  },

  //Questionnaires Questions
  {
    path: '/questionnaires_questions/:id?',
    name: 'questionnaires_questions',
    permission: 'access_questionnaireQuestion',
    component: () => import('@/views/quality/questionnaires_questions/index'),
    meta: { pageTitle: 'questionnaires_questions', breadcrumb: [{ to: '/questionnaires_types', text: 'questionnaires_types' }, { text: 'questionnaires_questions' }] },
  },
  {
    path: '/questionnaires_questions/show/:id',
    name: 'show_questionnairesQuestions',
    permission: 'show_questionnaireQuestion',
    component: () => import('@/views/quality/questionnaires_questions/show'),
    meta: { pageTitle: 'questionnaires_questions', breadcrumb: [{ to: '/questionnaires_types', text: 'questionnaires_types' }, { to: '/questionnaires_questions', text: 'questionnaires_questions' }, {text: 'questionnaireQuestion', active: true}] },
  },
  {
    path: '/questionnaires_questions/add',
    name: 'add_questionnaireQuestion',
    permission: 'add_questionnaireQuestion',
    component: () => import('@/views/quality/questionnaires_questions/show'),
    meta: { pageTitle: 'Add QuestionnairesQuestions', breadcrumb: [{ to: '/questionnaires_types', text: 'questionnaires_types' }, { to: '/questionnaires_questions', text: 'questionnaires_questions' }, {text: 'add', active: true}] },
  },
  {
    path: '/questionnaires_questions/edit/:id',
    name: 'edit_questionnaireQuestion',
    permission: 'edit_questionnaireQuestion',
    component: () => import('@/views/quality/questionnaires_questions/show'),
    meta: { pageTitle: 'Edit QuestionnairesQuestions', breadcrumb: [{ to: '/questionnaires_types', text: 'questionnaires_types' }, { to: '/questionnaires_questions', text: 'questionnaires_questions' }, {text: 'edit', active: true}] },
  },
];
