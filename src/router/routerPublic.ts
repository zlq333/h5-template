// 所有模块公用路由
const publicRouter = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/back/author',
    name: 'backAuthor',
    component: () => import('@/components/BackAuthor.vue'),
    meta: {
      title: '授权回调',
      checkToken: false
    }
  },
  {
    path: '/refresh/:reload?',
    name: 'Refresh',
    meta: {
      title: '刷新页面',
      checkToken: false,
      layoutType: 'none'
    },
    component: () => import('@/components/Refresh.vue')
  },
  {
    path: '/error/:code',
    name: 'Error',
    meta: {
      title: 'Error',
      checkToken: false,
      layoutType: 'none'
    },
    component: () => import('@/components/RouterError.vue')
  },
  { path: '/:pathMatch(.*)*', redirect: '/error/404' }
];
export default publicRouter;
