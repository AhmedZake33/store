export default [
    {
        path: '/users',
        name: 'users',
        component: () => import('@/views/user_settings/users/index'),
        meta: { pageTitle: 'users', breadcrumb: [{ text: 'user_settings' } , { text: 'users' }] },
    },
    {
        path: '/users/access/:id',
        name: 'user-access',
        permission: 'user_access_users',
        component: () => import('@/views/user_settings/users/user_access'),
        meta: {
            public: true,
            pageTitle: 'access',
            navActiveLink:'users',
            breadcrumb: [{ text: 'user_settings' } , { to: '/users', text: "Users" }, { text: 'User Access', active: true }],
        },
    },
    {
        path: '/users/show/add',
        name: 'user-add',
        permission: 'access_users',
        component: () => import('@/views/user_settings/users/show'),
        meta: {
            pageTitle: 'Add User',
            navActiveLink:'users',
            breadcrumb: [
                { text: 'user_settings' } ,
                { to: '/users', text: 'users' },
                { text: 'add_user', active: true }
            ],
        },
    },
    {
        path: '/users/:id',
        name: 'user-show',
        permission: 'access_users',
        component: () => import('@/views/user_settings/users/show'),
        meta: {
            public: true,
            pageTitle: 'user',
            navActiveLink:'users',
            breadcrumb: [{ text: 'user_settings' } , { to: '/users', text: "Users" }, { text: 'user', active: true }],
        },
    },
    {
        path: '/users/edit/:id',
        name: 'user-edit',
        permission: 'access_users',
        component: () => import('@/views/user_settings/users/edit'),
        meta: {
            pageTitle: 'Edit User',
            navActiveLink:'users',
            breadcrumb: [
                { text: 'user_settings' } ,
                { to: '/users', text: 'users' },
                { text: 'edit_user', active: true }
            ],
        },
    },
    {
        path: '/staff',
        name: 'staff',
        component: () => import('@/views/user_settings/staff/index'),
        meta: { pageTitle: 'staff',navActiveLink:'staff', breadcrumb: [{ text: 'user_settings' } , { text: 'staff' },], },
    },
    {
        path: '/instructors/edit/:id',
        name: 'staff-edit',
        permission: 'access_users',
        component: () => import('@/views/user_settings/staff/edit'),
        meta: {
            public: true,
            pageTitle: 'Edit Instructor',
            navActiveLink:'staff',
            breadcrumb: [{ text: 'user_settings' } , { to: '/staff', text: 'instructors' }, { text: 'Global.instructor_edit', active: true }],
        },
    },
    {
        path: '/instructors/reports',
        name: 'staff-report',
        permission: 'access_users',
        component: () => import('@/views/user_settings/staff/reports/show'),
        meta: {
            public: true,
            breadcrumb: [{ text: 'reports'}, { to: '/staff', text: 'staff-report' }],
        },
    },
    {
        path: '/instructors/show/add',
        name: 'staff-add',
        permission: 'access_users',
        component: () => import('@/views/user_settings/staff/show'),
        meta: {
            public: true,
            navActiveLink:'staff',
            pageTitle: 'Add Instructor',
            breadcrumb: [{ text: 'user_settings' } , { to: '/staff', text: 'instructors' }, { text: 'Global.instructor_add', active: true }],
        },
    },
    {
        path: '/instructors/:id',
        name: 'staff-show',
        permission: 'access_users',
        component: () => import('@/views/user_settings/staff/show'),
        meta: {
            public: true,
            pageTitle: 'staff',
            navActiveLink:'staff',
            breadcrumb: [{ text: 'user_settings' } , { to: '/staff', text: 'instructors' }, { text: 'instructor', active: true }],
        },
    },
    {
        path: '/employees',
        name: 'employees',
        component: () => import('@/views/user_settings/employees/index'),
        meta: { pageTitle: 'z',navActiveLink:'employees', breadcrumb: [{ text: 'user_settings' } , { text: 'employees' },], },
    },
    {
        path: '/employees/:id',
        name: 'employee-show',
        permission: 'access_users',
        component: () => import('@/views/user_settings/employees/show'),
        meta: {
            public: true,
            pageTitle: 'employee',
            navActiveLink:'employees',
            breadcrumb: [{ text: 'user_settings' } , { to: '/employees', text: 'employees' }, { text: 'employee', active: true }],
        },
    },
    {
        path: '/employee/edit/:id',
        name: 'employee-edit',
        component: () => import('@/views/user_settings/employees/edit'),
        meta: {
            pageTitle: 'Edit Employee',
            navActiveLink:'employees',
            breadcrumb: [
                { text: 'user_settings' } ,
                { to: '/employees', text: 'employees' },
                { text: 'edit_employee', active: true }
            ],
        },
    },
    {
        path: '/employee/show/add',
        name: 'employee-add',
        component: () => import('@/views/user_settings/employees/show'),
        meta: {
            pageTitle: 'Add Employee',
            navActiveLink:'employees',
            breadcrumb: [
                { text: 'user_settings' } ,
                { to: '/employees', text: 'employees' },
                { text: 'add_employee', active: true }
            ],
        },
    },
    {
        path: '/settings/roles',
        name: 'roles',
        component: () => import('@/views/user_settings/roles/index'),
        meta: { pageTitle: 'Roles',navActiveLink:'roles', breadcrumb: [{ text: 'user_settings' } , { text: 'roles' }] },
    },
    {
        path: '/settings/roles/details/:id?',
        name: 'roles-show',
        component: () => import('@/views/user_settings/roles/Details'),
        meta: { pageTitle: 'Details',navActiveLink:'roles', breadcrumb: [{ text: 'user_settings' } , { to: '/settings/roles', text: 'roles' },   { text: 'role', active: true }] },
    },
    {
        path: '/settings/user/role/:id',
        name: 'user-role',
        component: () => import('@/views/user_settings/roles/show'),
        meta: { pageTitle: 'Roles',navActiveLink:'roles', breadcrumb: [{ text: 'user_settings' } ,{ to: '/users', text: 'users' }, { text: 'User Role' }] },
    },
    {
        path: '/profile',
        name: 'user-profile',
        component: () => import('@/views/profile/show'),
        meta: {
            public: true,
            pageTitle: 'profile',
            navActiveLink:'users',
            breadcrumb: [{ text: 'profile', active: true }],
        },
    },
]
