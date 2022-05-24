import { Router } from 'vue-router';
import projectConfig from '@/config/config';
import { useGlobalStore } from '@/store/globalStore';
import { setStorage } from '@fe/utils';
import { getAccessToken } from '@/utils/weixin';
import { getPermission as getPermissionFun } from '@/utils/utils';

export const checkToken = (router: Router) => {
  router.beforeEach((to, from) => {
    let checkToken = to.meta && to.meta.checkToken;
    if (typeof checkToken !== 'boolean') checkToken = true;
    if (checkToken === false) {
      return true;
    } else {
      const token = localStorage.getItem(projectConfig.tokenKey) || '';
      if (token) {
        return true;
      } else {
        if (projectConfig.isWeixin) {
          if (projectConfig.wxConfig.checkAuthor) {
            // 存储授权完成后  回调需要进入的页面路由
            setStorage('backAuthorRouter', {
              name: to.name,
              params: to.params,
              query: to.query
            });
            // 调用微信获取token
            getAccessToken();
            return false;
          } else {
            return true;
          }
        } else {
          return '/login';
        }
      }
    }
  });
};

// 路由钩子 获取用户权限
export const getPermission = async (router: Router) => {
  router.beforeEach(async (to, from) => {
    // 每个路由都会校验是否需要token 若不需要请指定meta.checkToken为false
    let checkToken = to.meta && to.meta.checkToken;
    if (typeof checkToken !== 'boolean') checkToken = true;
    const store = useGlobalStore();
    if (checkToken && !store.isAcquiredPermission) {
      // 获取权限
      let res = await getPermissionFun({ isCheck: false });
      if (res.status !== 0) {
        return res.data;
      }
    }
    return true;
  });
};

// 路由钩子 判断页面访问权限
export const checkPermission = (router: Router) => {
  router.beforeEach((to, from) => {
    if (projectConfig.system.permission && to.meta.permission) {
      const permissionList: string[] = useGlobalStore().permission || [];
      if (!permissionList.includes(to.meta.permission as string)) {
        return { path: '/error/403', replace: true };
      }
    }
    return true;
  });
};

// 路由钩子 判断页面是否需要缓存
export const setKeepAlive = (router: Router) => {
  router.beforeEach((to, from) => {
    if (projectConfig.system.keepAlive) {
      if (to.meta.keepAlive && to.meta.keepAlive === true) {
        const store = useGlobalStore();
        const keepAliveRouter = store.keepAliveRouter || [];
        const keepAliveName = to.meta.keepAliveName || to.name;
        const idx = keepAliveRouter.findIndex((name: string) => name === keepAliveName);
        if (idx === -1) {
          store.addKeepAlive(keepAliveName as string);
        }
      }
    }
    return true;
  });
};

// 路由钩子 设置页面title
export const setTitle = (router: Router) => {
  router.beforeEach((to, from) => {
    let title = to.meta && (to.meta.title as string);
    title = title || projectConfig.system.name;
    document.title = title;
    return true;
  });
};
