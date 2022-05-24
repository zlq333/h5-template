<template>
  <div class="router-error-page">
    <fe-result v-if="errorType == '403'" class="error-403" title="抱歉" subTitle="您没有查看当前页面的权限~">
      <template #icon>
        <img class="error-img" src="../assets/img/403.png" alt="" />
      </template>
      <template #extra>
        <van-button type="primary" @click="handleBack">返 回</van-button>
      </template>
    </fe-result>
    <fe-result v-if="errorType == '404'" class="error-404" title="抱歉" subTitle="抱歉！页面找不到了~">
      <template #icon>
        <img class="error-img" src="../assets/img/404.png" alt="" />
      </template>
      <template #extra>
        <van-button type="primary" @click="handleBack">返 回</van-button>
      </template>
    </fe-result>
    <fe-result v-if="errorType == '500'" class="error-500" title="抱歉" subTitle="抱歉！程序出错了~">
      <template #icon>
        <img class="error-img" src="../assets/img/500.png" alt="" />
      </template>
      <template #extra>
        <van-button type="primary" @click="handleBack">返 回</van-button>
      </template>
    </fe-result>
    <fe-result
      v-if="errorType == '40301'"
      class="error-40301"
      title="抱歉"
      subTitle="抱歉！您暂时没有对应角色，请联系管理员分配~"
    >
      <template #icon>
        <img class="error-img" src="../assets/img/403.png" alt="" />
      </template>
      <template #extra>
        <van-button type="primary" @click="handleBack">返 回</van-button>
      </template>
    </fe-result>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import FeResult from '@/components/FeResult.vue';
export default defineComponent({
  components: { FeResult },
  setup() {
    const errorType = ref('403');
    const route = useRoute();
    errorType.value = (route.params.code as string) || '403';

    const handleBack = () => window.history.go(-1);
    const handleBackLogin = () => (window.location.href = './index.html#/login');
    return { errorType, handleBack, handleBackLogin };
  }
});
</script>
<style lang="postcss" scoped>
.router-error-page {
  width: 100%;
  background: #ffffff;
  box-sizing: border-box;
  height: 100%;
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
  align-items: center;

  :deep(.el-result) {
    position: relative;
    top: -200px;
  }
  :deep(.error-img) {
    width: 300px;
  }
}
</style>
