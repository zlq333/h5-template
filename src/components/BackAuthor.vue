<template>
  <div>{{ message }}</div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getQuery, getStorage } from '@fe/utils';
import useAxios from '@/utils/useAxios';
import api from '@/api/api';

export default defineComponent({
  async setup() {
    const router = useRouter();
    const message = ref('');

    // 微信静默授权后返回我们重定向地址
    const code = getQuery('code');
    console.log('back author code: ', code);

    let isAbort = false;

    if (!code) {
      message.value = '缺少code参数';
      isAbort = true;
    } else if (code === 'notCheck') {
      localStorage.setItem('token', 'dev_debug_token');
    } else {
      // 使用code去服务端获取token
      const res = await useAxios.get(api.queryAccessToken, { params: { code } });
      // 此时token有两种状态（已绑定，未绑定）
      // 未绑定就会进入绑定页面，已绑定就继续之前的逻辑
      localStorage.setItem('token', res.openId);

      if (!res.isBind) {
        router.replace({ path: '/login' });
        isAbort = true;
      }
    }

    if (!isAbort) {
      const backRouter = getStorage('backAuthorRouter');
      if (backRouter.name) {
        router.replace({
          name: backRouter.name,
          params: backRouter.params,
          query: backRouter.query
        });
      } else {
        console.log('back author error: not find backRouter');
        router.replace({ path: '/login' });
      }
    }

    return { message };
  }
});
</script>
