export default [
    {
        path: '/chats',
        name: 'chats',
        component: () => import('@/views/Requests/chat/index'),
        meta: {pageTitle: 'chats', breadcrumb: [{text: 'Communication'},{text: 'chats'}]},
    },
    {
        path: '/chat/message/:id',
        name: 'messages',
        component: () => import('@/views/Requests/chat/show'),
        meta: {
            pageTitle: 'messages',
            breadcrumb: [{to: '/chats', text: 'chats'}, {text: 'messages', active: true}]
        },
    },
]
