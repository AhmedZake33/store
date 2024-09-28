import {getAuth} from '@/auth/utils';

export default [
    {
        header: 'my_workspace',
        permission: getAuth().type.type == 1 ? 'public' : 'no_access'
    },
    {
        title: 'dashboard',
        icon: 'HomeIcon',
        route: 'dashboard',
        permission: getAuth().type.type == 1 ? 'public' : 'no_access'
    },
    {
        icon: 'ListIcon',
        title: 'Offerings',
        route: {name: 'my_courses_workspace'},
        permission: getAuth().type.type == 1 ? 'public' : 'no_access'
    },
    {
        title: 'Schedule',
        icon: 'CalendarIcon',
        route: {name: 'mySchedule', params: {id: getAuth().id}},
        permission: getAuth().type.type == 1 ? 'public' : 'no_access'
    },
    {
        title: 'Advising',
        icon: 'AwardIcon',
        route: 'my_advising',
        permission: getAuth().type.type == 1 ? 'public' : 'no_access'
    },
    {
        title: 'Research',
        icon: 'SearchIcon',
        permission: getAuth().type.type == 1 ? 'public' : 'no_access',
        children: [
            {
                title: 'theses',
                permission: getAuth().type.type == 1 ? 'public' : 'no_access',
                route: {name: 'my_theses', params: {id: getAuth().id}},
            },
            {
                title: 'Publications',
                permission: getAuth().type.type == 1 ? 'public' : 'no_access',
                route: {name: 'publications', params: {id: getAuth().id}},
            },
        ]
    },
    {
        title: 'Communication',
        icon: 'MessageCircleIcon',
        permission: getAuth().type.type == 1 ? 'public' : 'no_access',
        children: [
            {
                title: 'chat',
                permission: getAuth().type.type == 1 ? 'public' : 'no_access',
                route: 'chat',
            },
            {
                title: 'Tickets',
                permission: getAuth().type.type == 1 ? 'public' : 'no_access',
                route: 'my_tickets',
            },
        ]
    },
    {
        title: 'LMS',
        icon: 'BookIcon',
        href: process.env.VUE_APP_LMS_URL,
        permission: getAuth().type.type == 1 ? 'public' : 'no_access'
    },
    // {
    //     title: 'my_workspace',
    //     icon: 'UsersIcon',
    //     permission: 'access_users',
    //     children: [{
    //         title: 'courses',
    //         route: 'courses',
    //         permission: 'access_course',
    //     },
    //     {
    //         title: 'Schedules',
    //         route: {name:'mySchedule', params:{id: getAuth().id}},
    //         permission: 'access_offeringSchedule',
    //     },
    //     {
    //         title: 'chat',
    //         permission: 'access_request',
    //         route:'chats',
    //         // route: {name:'messages', params:{id: getAuth().id}},
    //     }]
    // },
    {
        header: 'education',
        permission: 'public'
    },
    {
        title: 'dashboard',
        icon: 'HomeIcon',
        route: 'dashboard',
        permission: getAuth().email == 'admin@EMS.com' ? 'public' : 'no_access'
    },
    {
        title: 'admissionUG',
        icon: 'LayersIcon',
        permission: 'public',
        children: [
            // {
            //     title: 'admission_terms',
            //     route: 'admission_terms',
            //     permission: 'access_term',
            // },
            {
                title: 'applicants',
                route: 'applicants',
                permission: 'access_applicant',
            },
            {
                title: 'distribution',
                route: 'distribution_applicants',
                permission: 'access-distribution_applicant',
            },
            {
                title: 'payments',
                route: 'admission-payments',
                permission: 'access-payment_applicant',
            },
            {
                title: 'students-paid',
                route: 'accepted_applicants',
                permission: 'access-paid_applicant',
            },
            {
                title: 'transfer_students',
                route: 'transfer_students',
                permission: 'access_transferStudent',
            },
            {
                title: 'transfered_distribution',
                route: 'transfered_distribution',
                permission: 'access_distribution_transferStudent',
            },
            {
                title: 'transfered_student_paid',
                route: 'transfered_student_paid',
                permission: 'access_paid_transferStudent',
            },
            {
                title: 'Applicants New',
                route: 'applicantsNew',
                permission: getAuth().email == 'admin@EMS.com' ? 'public' : 'no_access'
            },

        ],
    },
    {
        title: 'admissionPG',
        icon: 'ActivityIcon',
        permission: 'public',
        children: [
            // {
            //     title: 'admission_terms',
            //     route: 'admission_terms',
            //     permission: 'access_term',
            // },
            {
                title: 'applicants',
                route: 'applicants_pg',
                permission: 'access_postgraduateAdmission',
            },
            {
                title: 'distribution',
                route: 'distribution_applicants_pg',
                permission: 'access_distribution_postgraduateAdmission',
            },
            {
                title: 'students-paid',
                route: 'accepted_applicants_pg',
                permission: 'access_paid_postgraduateAdmission',
            },
        ],
    },
    {
        title: 'quality',
        icon: 'LayersIcon',
        permission: 'access_quality',
        children: [{
            title: 'CourseFiles',
            route: 'courseFile',
            permission: 'access_courseFiles',
        },
        ],
    },
    {
        title: 'students',
        icon: 'UserIcon',
        permission:'public',
        children: [
            {
                title: 'students_data',
                route: 'students',
                permission: 'access_student',
            },
            {
                title: 'scholarships',
                route: 'scholarships',
                permission: 'access_scholarship',
            },
            {
                title: 'certificates',
                route: 'certificates',
                permission: 'access_certificate',
            },
            {
                title: 'Correction Requests',
                route: {name: 'my_correction_requests'},
                permission: 'access_correctionRequests',
            },
            {
                title: 'Internal Transfers',
                route: 'internal-transfer',
                permission: 'access_internalTransfer',
            },
            {
                title: 'Advising',
                route: 'advising',
                permission: 'advisorRegistrationsAll_registration',
            },
            {
                title: 'Hotels_Reservations',
                route: 'reservations',
                permission: "access_hotel"
            },
            {
                title: 'services',
                route: 'services',
                permission: "access_other"
            },
        ],
    },

    {
        title: 'study',
        icon: 'BookOpenIcon',
        permission: 'access_study',
        children: [
            {
                title: 'academic_years',
                route: 'academic_years',
                permission: 'access_year',

            },
            {
                title: 'course_offerings',
                route: 'offerings',
                permission: 'access_offering',
            },
            {
                title: 'Academic Advisors',
                route: 'academic_advisors',
                permission: 'access_academicAdvisors',
            },
            {
                title: 'Advised Students',
                route: 'advised_students',
                permission: 'access_advisedStudents',
            },
            {
                title: 'registrations',
                route: 'registrations',
                permission: 'access_registration',
            },
            {
                title: 'Excuses',
                route: 'excuses',
                permission: 'access_excuse'
            },
        ],
    },
    {
        title: 'Medical Internship',
        icon: 'BookIcon',
        permission: 'access_emtyaz',
        children:[
            {
                title: 'Training',
                route: "emtyaz_training",
                permission: 'access_emtyazTraining'
                
            },
            {
                title: 'Registration',
                route: "emtyaz_registration",
                permission: 'access_emtyazRegistration'
                
            }
        ]
    },
   
    {
        title: 'examination',
        icon: 'PenToolIcon',
        permission: 'access_examination',
        children: [
            {
                title: 'exams',
                route: 'exams',
                permission: 'access_exam',
            },
            {   
                title: 'exams_schedules',
                route: 'exams_schedules',
                permission: 'access_examSchedule',
            },
            {
                title: 'exams_delivery',
                route: 'exams_delivery',
                permission: 'access_examDelivery',
            },
            {
                title: 'exams_absences',
                route: 'exams_absences',
                permission: 'access_examAbsence',
            },
            {
                title: 'exams_punishments',
                route: 'exams_punishments',
                permission: 'access_examPunishment',
            },
            {
                title: 'exams_barcodes',
                route: 'exams_barcodes',
                permission: 'access_examBarcode',
            },
            {
                title: 'papers_types',
                route: 'papers_types',
                permission: 'access_examPapersType',
            },
        ],
    },
    {
        title: 'control',
        icon: 'CompassIcon',
        permission: 'access_control',
        children: [
            {
                title: 'control_offerings',
                route: 'control_offerings',
                permission: 'accessOfferings_control',

            },
            {
                title: 'control_students',
                route: 'control_students',
                permission: 'accessStudents_control',
            },
            {
                title: 'control_results',
                route: 'control_results',
                //   permission: 'access_controlResults',
            },
            {
                title: 'grades_recheck',
                route: 'grades_recheck',
                permission: 'access_students_grades_recheck'
            },
        ],
    },
    {
        title: 'Student Activities',
        icon: 'UsersIcon',
        permission: 'access_training',
        children: [
            {
                title: 'Trainings',
                route: 'trainings',
                permission: 'access_training',
            },
            {
                title: 'Students Trainings',
                route: 'students_trainings',
                permission: 'access_training',
            },
        ],
    },
    {
        title: 'questionnaires',
        icon: 'FileTextIcon',
        permission: 'access_questionnaire',
        children: [
            {
                title: 'questionnaires_types',
                route: 'questionnaires_types',
                permission: 'access_questionnaireType',
            },
            {
                title: 'surveys',
                route: 'questionnaires',
                permission: 'access_questionnaire',
            },
        ],
    },
    {
        title: 'post_graduate',
        icon: 'BookIcon',
        permission: 'access_post_graduates',
        children: [
            {
                title: 'theses',
                route: 'theses',
                permission: 'access_students_thesis',
            },
            {
                title: 'Publications',
                route: {name: 'publications'},
                permission: 'access_publication',
            },
        ],
    },
    {
        title: 'financial',
        icon: 'DollarSignIcon',
        permission: 'access_financial',
        children: [
            {
                title: 'applicants',
                route: 'admission-payments'
            },
            {
                title: 'payments',
                route: 'payments',
                permission: 'access_payment'
            },
            {
                title: 'transactions',
                route: 'transactions',
                permission: 'access_transaction',
            },
            {
                title: 'credits',
                route: 'credits',
                permission: 'access_credit',
            },
        ],
    },
    {
        title: 'Communication',
        icon: 'MessageCircleIcon',
        permission: 'access_communication',
        children: [
            {
                title: 'all_chats',
                route: 'chats',
                permission: 'access_request',
            },
            {
                title: 'all_tickets',
                route: 'tickets',
                permission: 'access_ticket',
            }
        ]
    },
    {
        title: 'reports',
        icon: 'BookOpenIcon',
        route: 'reports',
        permission: 'access_reports',
        // children: [
        //     {
        //         title: 'applicants',
        //         route: 'admission-reports',
        //         permission: 'access_report_applicants',
        //     },
        //     {
        //         title: 'academic_staff',
        //         route: 'staff-report',
        //         permission: 'access_report_AcademicStaff',
        //     },
        //     {
        //         title: 'students',
        //         route: 'students-report',
        //         permission: 'access_report_students',
        //     },
        //     {
        //         title: 'Graduate',
        //         route: 'graduats-report',
        //         permission: 'access_report_Graduate',
        //     },
        //     {
        //         title: 'payments',
        //         route: 'payments-report',
        //         permission: 'access_report_payments',
        //     },
        //     {
        //         title: 'Registrations',
        //         route: 'registrations-report',
        //         permission: 'access_report_Registrations',
        //     },
        //     {
        //         title: 'Financials',
        //         route: 'Financial-report',
        //         permission: 'access_report_financials',
        //     },
        //     {
        //         title: 'FinancialSettings',
        //         route: 'finanicials-settings-reports',
        //         permission: 'access_report_financials',
        //     },
        //     {
        //         title: 'equivalent',
        //         route: 'equivalent-report',
        //         permission: 'access_report_equivalent',
        //     },
        //     {
        //         title: 'foreigner',
        //         route: 'foreigner-report',
        //         permission: 'access_report_foreigner',
        //     }
        // ]
    },
    {
        header: 'settings',
        permission: 'public'
    },
    {
        title: 'academic_settings',
        icon: 'CommandIcon',
        permission: 'access_academic',
        children: [

            {
                title: 'faculties',
                route: 'faculties',
                permission: 'access_faculty',
            },
            {
                title: 'departments',
                route: 'departments',
                permission: 'access_department',
            },
            {
                title: 'bylaws',
                route: 'bylaws',
                permission: 'access_bylaw',
            },
            {
                title: 'courses',
                route: 'courses',
                permission: 'access_course',
            },
            {
                title: 'programs',
                route: 'programs',
                permission: 'access_program',
            },
        ],
    },
    {
        title: 'services_settings',
        icon: 'LayersIcon',
        permission: 'access_financialSetting',
        children: [
            // {
            //     title: 'Certificate Settings',
            //     route: 'certificates_settings',
            //     permission: 'access_certificateSetting',
            // },
            {
                title: 'academic_years',
                route: 'payment_academic_years',
                permission: 'access_financial_years',
            },
        ],
    },
    {
        title: 'user_settings',
        icon: 'UserPlusIcon',
        permission: 'access_UsersSettings',
        children: [
            {
                title: 'users',
                route: 'users',
                permission: 'access_users',
            },
            {
                title: 'instructors',
                route: 'staff',
                permission: 'access_instructor',
            },
            {
                title: 'employees',
                route: 'employees',
                permission: 'access_employee',
            },
            {
                title: 'roles',
                route: 'roles',
                permission: 'access_roles',
            }
        ]
    },
    {
        title: 'Administration',
        icon: 'SettingsIcon',
        permission: 'access_administration',
        children: [
            {
                title: 'Schedule Settings',
                permission: 'accessScheduleSettings_administration',
                route: 'schedule-settings'
            },
            {
                title: 'Ticket Settings',
                permission: 'access_ticketGroup',
                route: 'ticket_groups'
            },
            {
                title: 'Tags',
                route: 'tags',
                permission: 'access_tags',
            },
            {
                title: 'Management',
                route: 'management',
                permission: 'access_management',
            },
            {
                title: 'Archive',
                route: 'archives',
                permission: 'access_archive',
            },
            {
                title: 'logs',
                route: 'logs',
                permission: 'access_logs',
            },
            {
                title: 'University',
                route: 'university',
                permission: 'access_university',
            },
            {
                title: 'Deployment',
                route: 'deployment',
                permission: 'access_university',
            },
            {
                title: 'Bank Settings',
                route: 'bank_settings',
                permission: 'access_bank',
            },
        ],

    },
    {
        title: 'Development',
        icon: 'SettingsIcon',
        permission: 'access_development',
        children: [
            {
                title: 'Development',
                permission: 'access_development',
                route: 'development'
            }
        ],
    },
    {
        title: 'OctopiApp',
        icon: 'TabletIcon',
        route: 'qr_code',
        permission: 'qr-auth_system',
    }
];
