export default [
    {
      path: '/payments/batches',
      name: 'batches',
      component: () => import('@/views/students/payments/components/batches'),
      meta: { pageTitle: 'payments', breadcrumb: [{text: 'financial'}, { to: '/payments', text: 'payments' }, { text: 'batches', active: true }]},
    },
    {
      path: '/payments/imported_payments',
      name: 'imported_payments',
      component: () => import('@/views/students/payments/components/imported_payments'),
      meta: { pageTitle: 'payments', breadcrumb: [{text: 'financial'}, { to: '/payments', text: 'payments' }, { text: 'imported_payments', active: true }]},
    },
    {
      path: '/admission-payments',
      name: 'admission-payments',
      component: () => import('@/views/admission/payments/index'),
      meta: { pageTitle: 'applicants', breadcrumb: [{text: 'financial'}, { text: 'admission-payments' }] },
    },
    {
      path: '/admission-payments/:id',
      name: 'admission-payment',
      permission: 'access_users',
      component: () => import('@/views/admission/payments/show'),
      meta: { pageTitle: 'applicant',navActiveLink:'admission-payments', breadcrumb: [{text: 'financial'}, { to: '/admission-payments', text: 'admission-payments' }, { text: 'applicant', active: true }] },
    },
    {
      path: '/payments',
      name: 'payments',
      component: () => import('@/views/students/payments/index'),
      meta: { pageTitle: 'payments', breadcrumb: [{text: 'financial'}, { text: 'payments' }] },
    },
    {
      path: '/payments/:id',
      name: 'payment',
      component: () => import('@/views/students/payments/show'),
      meta: { pageTitle: 'payment', breadcrumb: [{text: 'financial'}, { to: '/payments', text: 'payments' }, { text: 'payment', active: true }] },
    },
    {
      path: '/transactions',
      name: 'transactions',
      component: () => import('@/views/students/transactions/index'),
      meta: { pageTitle: 'transactions', breadcrumb: [{text: 'financial'}, { text: 'transactions' }] },
    },
    {
      path: '/transaction/:id',
      name: 'transaction',
      component: () => import('@/views/students/transactions/show'),
      meta: { pageTitle: 'transaction',navActiveLink:'transaction', breadcrumb: [{text: 'financial'}, { to: '/transactions', text: 'transactions' }, { text: 'transaction', active: true }] },
    },
    {
      path: '/credits',
      name: 'credits',
      component: () => import('@/views/students/credits'),
      meta: { pageTitle: 'credits', breadcrumb: [{text: 'financial'}, { text: 'credits' }] },
    },
    {
      path: '/credit/:id',
      name: 'credit',
      component: () => import('@/views/students/credits/show'),
      meta: { pageTitle: 'credit',navActiveLink:'credit', breadcrumb: [{text: 'financial'}, { to: '/credits', text: 'credits' }, { text: 'E-Wallet', active: true }] },
    },
    {
      path: '/payments/items/:id',
      name: 'payments_items',
      component: () => import('@/views/students/payments/components/payments_items'),
      meta: { pageTitle: 'payments', breadcrumb: [{text: 'financial'}, { to: '/payments', text: 'payments' }, { text: 'payment_items', active: true }]},
    },
    {
      path: '/payments/history/:id',
      name: 'payments_history',
      component: () => import('@/views/students/payments/components/payments_history'),
      meta: { pageTitle: 'payments', breadcrumb: [{text: 'financial'}, { to: '/payments', text: 'payments' }, { text: 'payment_history', active: true }]},
    },
    {
      path: '/payments/batch/:id',
      name: 'batch',
      component: () => import('@/views/students/payments/components/show_batch'),
      meta: { pageTitle: 'payments', breadcrumb: [{text: 'financial'}, { to: '/payments', text: 'payments' }, { to: '/payments/batches', text: 'batches' }, { text: 'Batch', active: true }]},
    },
    // payments report 
    {
      path: '/Financial-report',
      name: 'Financial-report',
      permission: "access_report_financial",
      component: () => import('@/views/reports/Financials'),
      meta: { pageTitle: 'Financials', breadcrumb: [{ text: 'reports' },{ text: 'Financials', active: true }] },
    },
  ]
