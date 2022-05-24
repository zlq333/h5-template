import { defineStore } from 'pinia';

interface GlobalState {
  isAcquiredPermission: boolean; // 是否已获取用户身份权限(用户权限是在路由钩子中获取的 这个flag用于避免重复获取)
  permission: string[]; // 用户权限
  keepAliveRouter: any[]; // 缓存的组件
  refreshRouter: any; // 记录刷新路由来源地址
  routerAnimation: boolean; // 启用禁用路由css动画
}

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useGlobalStore = defineStore('global', {
  // 状态
  state: () => {
    return {
      isAcquiredPermission: false,
      permission: [],
      keepAliveRouter: [],
      refreshRouter: null,
      routerAnimation: true
    } as GlobalState;
  },
  // 修改状态方法
  actions: {
    setAcquired(data: boolean) {
      this.isAcquiredPermission = data;
    },
    addKeepAlive(routerName: string) {
      this.keepAliveRouter.push(routerName);
    },
    removeKeepAlive(routerName: string) {
      const idx = this.keepAliveRouter.findIndex((val: string) => val === routerName);
      if (idx !== -1) {
        this.keepAliveRouter.splice(idx, 1);
      }
    },
    clearKeepAlive(data: any[]) {
      this.keepAliveRouter = data;
    }, // 设置权限数据
    setPermission(data: string[]) {
      this.permission = data;
    },
    setRefreshRouter(router: any) {
      this.refreshRouter = router;
    },
    enableRouterAnimation(data: boolean) {
      this.routerAnimation = data;
    }
  }
});
