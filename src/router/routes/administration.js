export default [
    {
        path: '/bank-settings',
        name: 'bank_settings',
        permission: 'access_bank',
        component: () => import('@/views/administration/bank_settings/index'),
        meta:  {pageTitle: 'Bank',breadcrumb: [{ text: 'Administration' },{to: '/bank-settings', text: 'Global.Bank Settings'}] }
    },
    {
        path: '/bank-settings/add',
        name: 'add_bank',
        permission: 'add_bank',
        component: () => import('@/views/administration/bank_settings/bank_name/edit.vue'),
        meta: {
            pageTitle: 'Add Bank',
            breadcrumb: [ {text: 'Administration'} ,{to: '/bank-settings', text: 'Global.Bank Settings'},{to: '/bank-settings', text: 'Bank'}, {text: 'add', active: true}]
        },
    },
    {
        path: '/bank-settings/edit/:id',
        name: 'edit_bank',
        permission: 'edit_bank',
        component: () => import('@/views/administration/bank_settings/bank_name/edit.vue'),
        meta: {
            pageTitle: 'Edit Bank',
            breadcrumb: [
                {text: 'Administration'} ,
                {to: '/bank-settings', text: 'Global.Bank Settings'},
                {to: '/bank-settings', text: 'Bank'}, {
                text: 'edit',
                active: false
            }, {text: 'bank', active: true}]
        },
    },
    {
        path: '/currency/add',
        name: 'add_currency',
        permission: 'add_currency_bank',
        component: () => import('@/views/administration/bank_settings/currency/edit.vue'),
        meta: {
            pageTitle: 'Add Bank',
            breadcrumb: [ {text: 'Administration'} , {to: '/bank-settings', text: 'Global.Bank Settings'},{to: '/bank-settings', text: 'Currency'}, {text: 'add', active: true}]
        },
    },
    {
        path: '/currency/edit/:id',
        name: 'edit_currency',
        permission: 'edit_currency_bnak',
        component: () => import('@/views/administration/bank_settings/currency/edit.vue'),
        meta: {
            pageTitle: 'Edit Bank',
            breadcrumb: [
                {text: 'Administration'} ,
                {to: '/bank-settings', text: 'Global.Bank Settings'},
                {to: '/bank-settings', text: 'Currency'}, 
                {
                text: 'edit',
                active: false
                }, {text: 'bank', active: true}]
        },
    },
    {
        path: '/bank-info/add',
        name: 'add_bankInfo',
        permission: 'add_bankInfo_bank',
        component: () => import('@/views/administration/bank_settings/bank_info/edit.vue'),
        meta: {
            pageTitle: 'Add Bank Info',
            breadcrumb: [ {text: 'Administration'} ,{to: '/bank-settings', text: 'Global.Bank Settings'}, {to: '/bank-settings', text: 'Global.bankInfo'}, {text: 'add', active: true}]
        },
    },
    {
        path: '/bank-info/edit/:id',
        name: 'edit_bankInfo',
        permission: 'edit_bankInfo_bnak',
        component: () => import('@/views/administration/bank_settings/bank_info/edit.vue'),
        meta: {
            pageTitle: 'Edit Bank',
            breadcrumb: [
                {text: 'Administration'} ,
                {to: '/bank-settings', text: 'Global.Bank Settings'},
                {to: '/bank-settings', text: 'Global.bankInfo'}, {
                text: 'edit',
                active: false
            }]
        },
    },
    {
        path: '/settings/university',
        name: 'university',
        component: () =>
            import('@/views/administration/university/index'),
        meta: {pageTitle: 'University', breadcrumb: [{text: 'Administration'} , {text: 'University', active: true}]},
    },
    {
        path: '/settings/logs',
        name: 'logs',
        component: () =>
            import('@/views/administration/logs/index'),
        meta: {pageTitle: 'Logs', breadcrumb: [{text: 'Administration'} , {text: 'Logs', active: true}]},
    },
    {
        path: '/settings/logs/view/:id/:tableName',
        name: 'log',
        component: () =>
            import('@/views/administration/logs/show'),
        meta: {
            pageTitle: 'Manage',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'Logs', to: '/settings/logs'},
                {text: 'Log', active: true},
            ],
        },
    },
    {
        path: '/archives',
        name: 'archives',
        component: () =>
            import('@/views/administration/archive/index'),
        meta: {pageTitle: 'archive', breadcrumb: [ {text: 'Administration'} , {text: 'Archive', active: true}]},
    },
    {
        path: '/editor/:id',
        name: 'editor',
        component: () =>
            import('@/views/administration/archive/components/editor'),
        meta: {pageTitle: 'archives', breadcrumb: [ {text: 'Administration'} , {text: 'Editor', active: true}]},
    },
    {
        path: '/management',
        name: 'management',
        component: () =>
            import('@/views/administration/management/management'),
        meta: {pageTitle: 'Settings', breadcrumb: [ {text: 'Administration'} , {text: 'Management', active: true}]},
    },
    {
        path: '/management/admission',
        name: 'admission',
        component: () =>
            import('@/views/administration/management/settings/index'),
        meta: {
            pageTitle: 'Settings',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'Management', to: '/management'},
                {text: 'Settings', active: true},
            ],
        },
    },
    {
        path: '/management/admission/view/:id',
        name: 'admission-show',
        component: () =>
            import('@/views/administration/management/settings/show'),
        meta: {
            pageTitle: 'admission',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'Management', to: '/management'},
                {text: 'Settings', active: true},
            ],
        },
    },

    {
        path: '/management/admission/add',
        name: 'settings-add',
        component: () =>
            import('@/views/administration/management/settings/edit'),
        meta: {
            pageTitle: 'admission',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'Management', to: '/management'},
                {text: 'Settings Add', active: true},
            ],
        },
    },

    {
        path: '/management/admission/edit/:id',
        name: 'settings-edit',
        component: () =>
            import('@/views/administration/management/settings/edit'),
        meta: {
            pageTitle: 'admission',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'Management', to: '/management'},
                {text: 'admission', active: true},
            ],
        },
    },
    {
        path: '/management/marks',
        name: 'marks',
        component: () =>
            import('@/views/administration/management/marks/index'),
        meta: {pageTitle: 'marks', breadcrumb: [ {text: 'Administration'} , {text: 'management', to: '/management'}, {text: 'marks'}]},
    },
    {
        path: '/management/marks/edit/:id',
        name: 'edit_mark',
        component: () =>
            import('@/views/administration/management/marks/edit'),
        meta: {
            pageTitle: 'marks',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'management', to: '/management'}, {
                to: '/management/marks',
                text: 'marks'
            }, {text: 'mark'}],
        },

    },
    {
        path: '/management/marks/add',
        name: 'add_mark',
        component: () =>
            import('@/views/administration/management/marks/edit'),
        meta: {
            pageTitle: 'marks',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'management', to: '/management'}, {
                to: '/management/marks',
                text: 'marks'
            }, {text: 'mark'}],
        },
    },
    {
        path: '/management/markCategories',
        name: 'markCategories',
        component: () =>
            import('@/views/administration/management/markCategories/index'),
        meta: {
            pageTitle: 'markCategories',
            breadcrumb: [ {text: 'Administration'} , {text: 'management', to: '/management'}, {text: 'mark_categories'}]
        },
    },
    {
        path: '/management/markCategories/edit/:id',
        name: 'edit_markCategory',
        component: () =>
            import('@/views/administration/management/markCategories/edit'),
        meta: {
            pageTitle: 'markCategories',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'management', to: '/management'}, {
                to: '/management/markCategories',
                text: 'mark_categories'
            }, {
                text: 'mark_category',

            }],
        },

    },
    {
        path: '/management/markCategories/add',
        name: 'add_markCategory',
        component: () =>
            import('@/views/administration/management/markCategories/edit'),
        meta: {
            pageTitle: 'markCategories',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'management', to: '/management'}, {
                to: '/management/markCategories',
                text: 'mark_categories'
            }, {
                text: 'mark_category',

            }],
        },

    },
    {
        path: '/management/stages',
        name: 'stages',
        component: () =>
            import('@/views/administration/management/term_stage/index'),
        meta: {
            pageTitle: 'term_stages',
            breadcrumb: [ {text: 'Administration'} , {text: 'Management', to: '/management'}, {text: 'Term Stages', active: true}],
        },
    },
    {
        path: '/management/stages/add',
        name: 'add_term_stage',
        component: () =>
            import('@/views/administration/management/term_stage/edit'),
        meta: {
            pageTitle: 'term_stages',
            breadcrumb: [ {text: 'Administration'} , {text: 'Management', to: '/management'}, {text: 'Term Stages', active: true}],
        },
    },
    {
        path: '/management/stages/edit/:id',
        name: 'edit_term_stage',
        component: () =>
            import('@/views/administration/management/term_stage/edit'),
        meta: {
            pageTitle: 'term_stages',
            breadcrumb: [ {text: 'Administration'} , {text: 'Management', to: '/management'}, {text: 'Term Stages', active: true}],
        },
    },
    {
        path: '/management/stages/:id',
        name: 'term_stage',
        component: () =>
            import('@/views/administration/management/term_stage/show'),
        meta: {
            pageTitle: 'term_stage',
            breadcrumb: [ {text: 'Administration'} , {text: 'Management', to: '/management'}, {text: 'Term Stages', active: true}],
        },
    },

    {
        path: '/schedule-settings',
        name: 'schedule-settings',
        permission: 'accessScheduleSettings_administration',
        component: () => import('@/views/administration/schedule_settings/schedule_settings'),
        meta: {pageTitle: 'Schedule Settings', breadcrumb: [ {text: 'Administration'} , {text: 'Schedule Settings', active: true}]},
    },

    {
        path: '/buildings/add',
        name: 'add_building',
        permission: 'edit_building',
        component: () => import('@/views/administration/schedule_settings/buildings/edit.vue'),
        meta: {
            pageTitle: 'Add Building',
            breadcrumb: [ {text: 'Administration'} , {to: '/schedule-settings', text: 'Schedule Settings'}, {text: 'add', active: true}]
        },
    },

    {
        path: '/buildings/edit/:id',
        name: 'edit_building',
        permission: 'edit_building',
        component: () => import('@/views/administration/schedule_settings/buildings/edit.vue'),
        meta: {
            pageTitle: 'Edit Building',
            breadcrumb: [
                {text: 'Administration'} ,
                {to: '/schedule-settings', text: 'Schedule Settings'}, {
                text: 'edit',
                active: false
            }, {text: 'building', active: true}]
        },
    },

    {
        path: '/locations/add',
        name: 'add_location',
        component: () =>
            import('@/views/administration/schedule_settings/locations/show'),
        meta: {
            pageTitle: 'locations',
            breadcrumb: [ {text: 'Administration'} , {to: '/schedule-settings?tabNum=1', text: 'Schedule Settings'}, { text: 'add', active: true }],
        },
        permission: 'add_location',
    },
    {
        path: '/location/:id',
        name: 'location',
        component: () =>
            import('@/views/administration/schedule_settings/locations/show'),
        meta: {
            pageTitle: 'locations',
            breadcrumb: [ {text: 'Administration'} , {to: '/schedule-settings?tabNum=1', text: 'Schedule Settings'}, { text: 'location', active: true }],
        },
        permission: 'show_location',
    },
    {
        path: '/locations/edit/:id',
        name: 'edit_location',
        component: () =>
            import('@/views/administration/schedule_settings/locations/show'),
        meta: {
            pageTitle: 'locations',
            breadcrumb: [ {text: 'Administration'} , {to: '/schedule-settings?tabNum=1', text: 'Schedule Settings'}, {text: 'edit', active: true}],
        },
        permission: 'edit_location',
    },
    {
        path: '/slots/add',
        name: 'add_slot',
        component: () =>
            import('@/views/administration/schedule_settings/slots/edit'),
        meta: {
            pageTitle: 'Time Slots',
            breadcrumb: [ {text: 'Administration'} , {to: '/schedule-settings?tabNum=2', text: 'Schedule Settings'}, {text: 'slot', active: true}],
        },
        permission: 'add_slot',
    },
    {
        path: '/slots/edit/:id',
        name: 'edit_slot',
        component: () =>
            import('@/views/administration/schedule_settings/slots/edit'),
        meta: {
            pageTitle: 'Exam Slots',
            breadcrumb: [ {text: 'Administration'} , {to: '/schedule-settings?tabNum=2', text: 'Schedule Settings'}, {text: 'slot', active: true}],
        },
        permission: 'edit_slot',
    },
    {
        path: '/exam_slots/add',
        name: 'add_exam_slot',
        component: () =>
            import('@/views/administration/schedule_settings/exam_slots/edit'),
        meta: {
            pageTitle: 'Exam Slots',
            breadcrumb: [ {text: 'Administration'} , {to: '/schedule-settings?tabNum=3', text: 'Schedule Settings'}, {
                text: 'exam_slots',
                active: true
            }],
        },
        // permission: 'edit_slot',
    },
    {
        path: '/exam_slots/edit/:id',
        name: 'edit_exam_slot',
        component: () =>
            import('@/views/administration/schedule_settings/exam_slots/edit'),
        meta: {
            pageTitle: 'Time Slots',
            breadcrumb: [ {text: 'Administration'} , {to: '/schedule-settings?tabNum=3', text: 'Schedule Settings'}, {
                text: 'exam_slots',
                active: true
            }],
        },
        // permission: 'edit_slot',
    },
    {
        path: '/management/groups',
        name: 'groups',
        component: () =>
            import('@/views/administration/management/groups/index'),
        meta: {pageTitle: 'groups', breadcrumb: [ {text: 'Administration'} , {text: 'management', to: '/management'}, {text: 'groups'}]},
    },
    {
        path: '/management/groups/edit/:id',
        name: 'edit_group',
        component: () =>
            import('@/views/administration/management/groups/edit'),
        meta: {
            pageTitle: 'groups',
            breadcrumb: [ {text: 'Administration'} , {text: 'management', to: '/management'}, {to: '/management/groups', text: 'groups'}, {
                text: 'group',

            }],
        },

    },
    {
        path: '/management/groups/add',
        name: 'add_group',
        component: () =>
            import('@/views/administration/management/groups/edit'),
        meta: {
            pageTitle: 'groups',
            breadcrumb: [ {text: 'Administration'} , {text: 'management', to: '/management'}, {to: '/management/groups', text: 'groups'}, {
                text: 'group',

            }],
        },

    },
    {
        path: '/settings/years',
        name: 'academic_years',
        component: () =>
            import('@/views/system/years/index'),
        meta: {pageTitle: 'years', breadcrumb: [{ text: 'study'} ,  {text: 'academic_years', active: true}]},
    },
    {
        path: '/settings/payment',
        name: 'payment_academic_years',
        component: () =>
            import('@/views/system/years/payments'),
        meta: {pageTitle: 'years',navActiveLink:'payment_academic_years', breadcrumb: [{text: 'services_settings'} , {text: 'academic_years', active: true}]},
    },
    {
        path: '/settings/years/show/:id?',
        name: 'year',
        component: () =>
            import('@/views/system/years/show'),
        meta: {pageTitle: 'years',navActiveLink:'academic_years', breadcrumb: [{ text: 'study'} ,  {text: 'academic_years',to: '/settings/years'} , {text: 'year', active: true}]},
    },
    {
        path: '/settings/year/payment/:id',
        name: 'payment_year',
        component: () =>
            import('@/views/system/years/payment'),
        meta: {pageTitle: 'years',navActiveLink:'payment_academic_years', breadcrumb: [{text: 'services_settings'} ,  {text: 'payment_academic_years', to: '/settings/payment'} , {text: 'year', active: true}]},
    },
    {
        path: '/ticket-groups',
        name: 'ticket_groups',
        component: () =>
            import('@/views/administration/management/ticket_groups/index'),
        meta: {
            pageTitle: 'groups list',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'Ticket Group Settings', active: true},
            ]
        },
    },
    {
        path: '/ticket-groups/add',
        name: 'ticket_group_add',
        component: () =>
            import('@/views/administration/management/ticket_groups/show_edit'),
        meta: {
            pageTitle: 'add group',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'Ticket Groups', to: {name:'ticket_groups'}},
                {text: 'New Group', active: true},
            ]
        },
    },
    {
        path: '/ticket-groups/add/:id',
        name: 'ticket_group_edit',
        component: () =>
            import('@/views/administration/management/ticket_groups/show_edit'),
        meta: {
            pageTitle: 'edit group',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'Ticket Groups', to: {name:'ticket_groups'}},
                {text: 'New Group', active: true},
            ]
        },
    },
    {
        path: '/ticket-groups/:id',
        name: 'ticket_group_show',
        component: () =>
            import('@/views/administration/management/ticket_groups/show'),
        meta: {
            pageTitle: 'show group',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'Ticket Groups', to: {name:'ticket_groups'}},
                {text: 'Show Group', active: true},
            ]
        },
    },
    // {
    //     path: '/ticket-groups/group/edit/:id',
    //     name: 'ticket_group_edit',
    //     component: () =>
    //         import('@/views/administration/management/ticket_groups/components/showEdit'),
    //     meta: {
    //         pageTitle: 'show group',
    //         breadcrumb: [
    //             {text: 'Administration'} ,
    //             {text: 'Ticket Groups', to: {name:'ticket_groups'}},
    //             {text: 'Show Group', active: true},
    //         ]
    //     },
    // },
    {
        path: '/ticket-groups/edit/:id',
        name: 'ticket_group_Member',
        component: () =>
            import('@/views/administration/management/ticket_groups/components/edit_member'),
        meta: {
            pageTitle: 'edit member',
            breadcrumb: [
                {text: 'Administration'} ,
                {text: 'Ticket Groups', to: {name:'ticket_groups'}},
                {text: 'edit member Group', active: true},
            ]
        },
    },

    {
        path: '/tags',
        name: 'tags',
        component: () =>
            import('@/views/administration/tags/index.vue'),
        meta: {
            pageTitle: 'Tags',
            breadcrumb: [
                {text: 'Tags'} ,
                {text: 'Tags', active: true},
            ]
        },
    },
    {
        path: '/deployment',
        name: 'deployment',
        component: () =>
            import('@/views/administration/deployment/index'),
        meta: {pageTitle: 'Deployment', breadcrumb: [{text: 'Administration'} , {text: 'Deployment', active: true}]},
    },
]
