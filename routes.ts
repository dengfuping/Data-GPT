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
            redirect: '/instance',
          },
          {
            path: 'instance/:instanceId',
            component: 'Instance/Detail',
          },
          {
            path: 'instance',
            component: 'Instance',
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
