import Cookies from 'js-cookie';
let auth = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
export default [
    {
        header: 'education',
        permission: 'public'
    },
    {
        title: 'dashboard',
        icon: 'HomeIcon',
        route: 'dashboard',
        permission: 'public'
    },
    {
        title: 'Profile',
        icon: 'UserIcon',
        permission: 'public',
        children: [
            {
                title: 'personal',
                route: { name: 'student_profile' },
            },
            {
                title: 'academic',
                route: { name: 'student_academic' },
            },
            {
                title: 'Correction Requests',
                route: { name: 'my_correction_requests' },
            },
        ],
    },
    {
        title: 'My Courses',
        icon: 'BookIcon',
        permission: 'public',
        route:'my_courses'
    },
    {
        title: 'My Excuses',
        icon: 'FileTextIcon',
        permission: 'public',
        route:'my_excuses'
    },
    {
        title: 'study_current_term',
        icon: 'BookOpenIcon',
        permission: 'public',
        children: [
            {
                title: 'course_registration',
                route: { name: 'offering_registration' }
            },
            // {
            //     title: 'study_schedule',
            //     route: 'study_schedule'
            // },
            // {
            //     title: 'exam_schedule',
            //     route: 'exam_schedule'
            // },
        ],
    },
    {
        title: 'services',
        icon: 'ServerIcon',
        permission: 'public',
        children: [
            // {
            //     title: 'tuition_fees',
            //     route: 'tuition_fees'
            // },
            {
                title: 'Certificates',
                route: 'certification',
                // route: { name: 'certification', params: { id: 5 } },
            },
            // {
            //     title: 'housing',
            //     route: 'housing'
            // },
        ],
    },
    // {
    //     title: 'financial',
    //     icon: 'TrendingUpIcon',
    //     route: 'financial',
    //     permission: 'public',
    // },

];
