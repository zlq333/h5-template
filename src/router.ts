import { createRouter, createWebHashHistory, Router, RouteRecordRaw } from 'vue-router';

import transitionExtend from '@/router/transition-extend'; // 引入扩展函数(路由动画)
import * as routerHook from '@/router/routerHook';

import routerPublic from '@/router/routerPublic';
import index from '@/router/index';

const routes: Array<RouteRecordRaw> = [...index, ...routerPublic];

let router: Router = createRouter({
  history: createWebHashHistory(),
  routes
});
// 对router对象扩展
router = transitionExtend(router);

// 校验token
routerHook.checkToken(router);
// 获取用户权限
// routerHook.getPermission(router);
// 路由钩子 设置页面缓存
routerHook.setKeepAlive(router);
// 路由钩子 设置页面title
routerHook.setTitle(router);

export default router;
