export default [
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@/views/chat/chat/index'),
    meta: {
      pageTitle: 'My Chats',
      breadcrumb: [{ text: 'Chat', active: true }],
      contentRenderer: 'sidebar-left',
      contentClass: 'chat-application',
    },
  },
  {
    path: '/my-chat',
    name: 'my_chats',
    //component: () => import('@/views/chat/chat/index'),
    meta: {
      pageTitle: 'My Chats',
      breadcrumb: [{ text: 'Chat', active: true }],
      contentRenderer: 'sidebar-left',
      contentClass: 'chat-application',
    },
  },
  {
    path: '/chats/:chat_id/show/:user_id',
    name: 'global-chat',
    component: () => import('@/views/chat/chat/show'),
    meta: {
      pageTitle: 'Chat',
      breadcrumb: [
        { to: { name: 'chat' }, text: 'Chats' },
        { text: 'Chat Box', active: true },
      ],
      contentRenderer: 'sidebar-left',
      contentClass: 'chat-application',
    },
  },
  {
    path: '/tickets/chats/:chat_id',
    name: 'ticket_chat',
    component: () => import('@/views/chat/chat/show'),
    meta: {
      pageTitle: 'Chat',
      breadcrumb: [
        { to: { name: 'chat' }, text: 'Chats' },
        { text: 'Chat Box', active: true },
      ],
      contentRenderer: 'sidebar-left',
      contentClass: 'chat-application',
    },
  }
];
