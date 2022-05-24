var router = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/index/Home.vue'),
    meta: {
      title: '首页',
      checkToken: false
    }
  },
  {
    path: '/list',
    name: 'ListDemo',
    component: () => import('@/views/index/ListDemo.vue'),
    meta: {
      title: '列表',
      checkToken: false
    }
  }
];
export default router;
