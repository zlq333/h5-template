import api from '@/api/api';
import useAxios from '@/utils/useAxios';
import { getStorage, setStorage } from '@fe/utils';
import { useGlobalStore } from '@/store/globalStore';
import { AxiosRequestConfig } from 'axios';
import { unref } from 'vue';
import router from '@/router';

/**
 * 清除用户token 及其他缓存数据
 */
export function clearToken() {
  // 保留这些缓存不清除
  const retainStorage = {
    dev_host: localStorage.getItem('dev_host') || '',
    debug_server: localStorage.getItem('debug_server' || '')
  };
  localStorage.clear();
  Object.keys(retainStorage).forEach((key: string) => {
    retainStorage[key] && localStorage.setItem(key, retainStorage[key]);
  });

  const globalStore = useGlobalStore();
  globalStore.setAcquired(false);
  globalStore.clearKeepAlive([]);
}

/**
 * 获取菜单及权限
 * @param config {AxiosRequestConfig} axios请求配置项
 * @returns {any}
 */
export function getPermission(config?: AxiosRequestConfig): Promise<any> {
  return new Promise(async (resolve, reject) => {
    let isCheck = config && config.isCheck;
    if (typeof isCheck !== 'boolean') isCheck = true;
    // getPermission在登录时 和 路由钩子中都会调用
    // 登录时调用 isCheck不用配置 默认为true正常请求
    // 路由钩子中调用 请配置isCheck===false需要特殊处理 返回状态 由路由钩子retur ptah重定向的方式跳转
    try {
      let res = await useAxios<any>({ ...config, method: 'post', url: api.getUserMenuTree, data: {} });
      if (isCheck) {
        // res是不包含code的数据
        resolve(res);
      } else {
        // res是包含code的数据
        if (res.code === 200) {
          useGlobalStore().setAcquired(true); // 标记用户权限 已获取
          resolve({ status: 0, data: res.data });
        } else if (res.code === 403 || res.code === 401) {
          clearToken();
          resolve({ status: 1, data: '/login' });
        } else {
          resolve({ status: 1, data: '/error/500' });
        }
      }
    } catch (error) {
      if (isCheck) {
        reject(error);
      } else {
        resolve({ status: 1, data: '/error/500' });
      }
    }
  });
}

// 获取地址栏所有参数
export function getQueryAll() {
  let queryUrl = '';
  if (window.location.search) {
    queryUrl = window.location.search.substring(1);
  } else if (window.location.hash) {
    // 第一个问号后的都视为query
    queryUrl = window.location.hash.substring(window.location.hash.indexOf('?') + 1);
  } else {
    return {};
  }
  let rtn = {};
  const queryList = queryUrl.split('&');
  queryList.forEach(el => {
    const key = el.substring(0, el.indexOf('='));
    const value = el.substring(el.indexOf('=') + 1);
    rtn[key] = value;
  });
  return rtn;
}

/**
 * 获取字典数据
 * @param key {string} 某个字典key 为空则返回全部字典集合
 * @param reload {boolean} 是否重新请求接口获取最新数据 默认值false
 * @returns {any}
 */

export function getDict(key: string): Promise<Dict[]>;
export function getDict(key: '', reload: boolean): Promise<DictAll>;
export function getDict(key: string, reload: boolean = false): Promise<Dict[] | DictAll> {
  return new Promise(async (resolve, reject) => {
    let _dict = getStorage('sysDict') || {};
    if (reload || !(Object.keys(_dict).length > 0)) {
      let result = await useAxios.post(api.queryDictAll);
      setStorage('sysDict', result);
      _dict = result;
    }
    resolve(key ? _dict[key] : _dict);
  });
}

// 刷新路由的方法
export function refreshRouter(reload?: boolean) {
  const globalStore = useGlobalStore();
  globalStore.setRefreshRouter(unref(router.currentRoute));
  (router.customRouterData as any).enableAnimation = false;

  globalStore.enableRouterAnimation(false);
  const path = reload ? '/refresh/reload' : '/refresh';
  router.push(path);
}

// 刷新路由的方法
export function refreshRouter(reload?: boolean) {
  const globalStore = useGlobalStore();
  globalStore.editLayout('enableAnimation', false); // 刷新的时候禁用路由动画
  globalStore.setRefreshRouter(unref(router.currentRoute));
  const path = reload ? '/refresh/reload' : '/refresh';
  router.replace(path);
}

/**
 * @param fn 需要执行的函数
 * @param wait 等待时间
 * @returns 节流函数
 */
 export function throttle(fn: { apply: (arg0: any, arg1: any[]) => void }, wait: number) {
  let flag = true;
  const interval = wait || 500;
  return function (this: any, ...args: any) {
    if (flag) {
      fn.apply(this, args);
      flag = false;
      setTimeout(() => {
        flag = true;
      }, interval);
    }
  };
}
/**
 * @param fn 需要执行的函数
 * @param wait 等待时间
 * @returns 防抖函数
 */
export function debounce(fn: { apply: (arg0: any, arg1: any) => void }, wait: number) {
  let timeId: any = null;
  const delay = wait || 500;
  return function (this: any, ...args: any) {
    if (timeId) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      timeId = null;
      fn.apply(this, args);
    }, delay);
  };
}
