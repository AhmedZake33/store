export default [
  {
    path: '/my-tickets',
    name: 'my_tickets',
    component: () => import('@/views/ticket/my_tickets/index'),
    meta: {
      pageTitle: 'My Tickets',
      breadcrumb: [
        { text: 'My Tickets', active: true },
      ],
    },
  },
  {
    path: '/my-tickets/add',
    name: 'add_ticket',
    component: () => import('@/views/ticket/my_tickets/add'),
    meta: {
      pageTitle: 'Create Ticket',
      breadcrumb: [
        { to: { name: 'my_tickets' }, text: 'My Tickets' },
        { text: 'Create Ticket', active: true },
      ],
    },
  },
  {
    path: '/my-tickets/:id',
    name: 'my_ticket_show',
    component: () => import('@/views/ticket/my_tickets/show'),
    meta: {
      pageTitle: 'Ticket',
      breadcrumb: [
        { to: { name: 'my_tickets' }, text: 'My Tickets' },
        { text: 'Ticket Details', active: true },
      ],
    },
  },
  {
    path: '/tickets',
    name: 'tickets',
    component: () => import('@/views/ticket/tickets/index'),
    meta: {
      pageTitle: 'Tickets',
      breadcrumb: [{ text: 'Tickets', active: true }],
    },
  },
  {
    path: '/tickets/:id',
    name: 'ticket_show',
    component: () => import('@/views/ticket/tickets/show'),
    meta: {
      pageTitle: 'Ticket',
      breadcrumb: [
        { to: { name: 'tickets' }, text: 'Tickets' },
        { text: 'Ticket Details', active: true },
      ],
    },
  },
]
