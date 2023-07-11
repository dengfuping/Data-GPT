export default [
  {
    path: '/',
    component: 'Layout',
    routes: [
      {
        path: '/',
        component: 'Layout/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/connection',
          },
          {
            path: 'connection/:connectionId',
            component: 'Connection/Detail',
          },
          {
            path: 'connection',
            component: 'Connection',
          },
          {
            path: 'chat',
            component: 'Chat',
          },
        ],
      },
    ],
  },
];
