// 仅在内网构建环境、测试环境 启用vConsole，开发环境和生产构建环境不需要
const VITE_BUILDENV = import.meta.env.VITE_BUILDENV;
if (VITE_BUILDENV === 'debug' || VITE_BUILDENV === 'dev' || VITE_BUILDENV === 'test') {
  new VConsole();
}

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

import router from './router';

// 常用vant组件全局注册
import components from '@/utils/useComponents';

const app = createApp(App);

app.use(router);
app.use(createPinia());
components.forEach(component => app.use(component));

app.mount('#app');
