// 配置文件
import publicKey from './publicKey';
const NODE_ENV = process.env.NODE_ENV;
console.log('this node_env is ' + NODE_ENV);

const VITE_BUILDENV = import.meta.env.VITE_BUILDENV;
console.log('this vite_build_env is ' + VITE_BUILDENV);

const VITE_SYSTEM_NAME = import.meta.env.VITE_SYSTEM_NAME; // 项目名称
const VITE_ISWEIXIN = import.meta.env.VITE_ISWEIXIN; // 是否是微信应用
const isWeixin = VITE_ISWEIXIN === 'true' ? true : false;

const tokenKey = 'token'; // token存储在localStorage中的key

const config = {
  // 内网配置
  dev: {
    publicKey: publicKey.dev,
    baseURL: '//gateway.dev.wyyt.cc/cu/enterprise',
    uploadURL: 'http://192.168.6.12:8155',
    env: 'dev',
    tokenKey,
    isWeixin, // 是否在微信中
    wxConfig: {
      checkAuthor: false, // 微信中token过期 是否重新获取
      appid: 'wx87c2aa7bb2618dd2', // 上海翼畅临时测试号
      redirectUrl: 'http://wxsjb1.natapp1.cc/#/back/author' // 授权回调页面
    },
    system: {
      permission: true, // 是否校验权限
      keepAlive: true, // 是否启用页面缓存
      name: VITE_SYSTEM_NAME // 项目名称
    }
  },
  // 测试配置
  test: {
    publicKey: publicKey.test,
    baseURL: '//sc-gateway.test027.com/cu/enterprise',
    uploadURL: 'https://boot-service.test.wyyt.cc',
    env: 'test',
    tokenKey,
    isWeixin,
    wxConfig: {
      checkAuthor: false,
      appid: 'wxd23f559f97207be2', // 上海翼畅
      redirectUrl: 'http://webtest.sijibao.com/wx-driver/#/back/author'
    },
    system: {
      permission: true,
      keepAlive: true,
      name: VITE_SYSTEM_NAME
    }
  },
  // 生产配置
  prod: {
    publicKey: publicKey.prod,
    baseURL: '//gateway.wyyt.com/cu/enterprise',
    uploadURL: 'https://boot-service.sijibao.com',
    env: 'prod',
    tokenKey,
    isWeixin,
    wxConfig: {
      checkAuthor: false,
      appid: 'wxb6b25a2b9c4d5d9e', // 司机宝物流
      redirectUrl: 'http://wechat.sijibao.com/#/back/author'
    },
    system: {
      permission: true,
      keepAlive: true,
      name: VITE_SYSTEM_NAME
    }
  }
};

// 根据环境变量 导出对应配置
let projectConfig: Config;
if (NODE_ENV === 'development' || VITE_BUILDENV === 'dev') {
  /**
   * debug_server -> 调试服务器
   * 在开发模式下 为方便调试  开发者可自行修改debug_server 用本地项目连接不同的目标服务器
   * debug_server：dev  开发服务器(默认)
   * debug_server：test 测试服务器
   * debug_server：prod 生产服务器
   */

  let envkey = localStorage.getItem('debug_server') || 'dev';
  if (envkey != 'dev' && envkey != 'test' && envkey != 'prod') envkey = 'dev';

  projectConfig = config[envkey];

  if (envkey === 'dev') {
    // 本机开发模式默认连接内网服务器
    // 若本地localStorage存在dev_host 则覆盖默认目标
    const dev_host = localStorage.getItem('dev_host') || '';

    if (dev_host) projectConfig.baseURL = dev_host;
  }
} else {
  projectConfig = config[VITE_BUILDENV as string];
}

export default projectConfig;
