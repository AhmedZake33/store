export default [
    {
        path: '/reservations',
        name: 'reservations',
        permission: 'access_hotel',
        component: () => import('@/views/hotels/index'),
        meta:  {pageTitle: 'hotels',breadcrumb: [{ text: 'students' } , { text: 'Hotels_Reservations' , active: true }] }
    },
    {
        path: '/reservation/:id',
        name: 'show_reservation',
        permission: 'access_hotel',
        component: () => import('@/views/hotels/show'),
        meta:  {pageTitle: 'hotels',navActiveLink:'reservations',breadcrumb: [{ text: 'students' } , { text: 'Hotels_Reservations',to: '/reservations' } , {text:'show' , active:true}] }
    },
]