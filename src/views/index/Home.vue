<template>
  <div class="home-page">
    <fe-result v-if="type === 'info'" icon="info" title="提示信息" subTitle="提示信息，哦哦哦"></fe-result>
    <fe-result v-if="type === 'warning'" icon="warning" title="警告信息" subTitle="警告信息，哦哦哦"></fe-result>
    <fe-result v-if="type === 'success'" icon="success" title="成功信息" subTitle="成功信息，哦哦哦"></fe-result>
    <fe-result v-if="type === 'error'" icon="error" title="错误信息" subTitle="错误信息，哦哦哦"></fe-result>

    <van-divider />
    <div class="text-c">
      <van-button type="success" @click="typeChange('success')">成功</van-button>
      <van-button type="danger" @click="typeChange('error')">失败</van-button>
      <van-button type="warning" @click="typeChange('warning')">警告</van-button>
      <van-button type="default" @click="typeChange('info')">信息</van-button>
    </div>

    <van-divider>搜索</van-divider>
    <van-search v-model="searchVal" placeholder="请输入搜索关键词" />
    <van-search v-model="searchVal" shape="round" background="#4fc08d" placeholder="请输入搜索关键词" />
    <van-card num="2" price="2.00" desc="描述信息" title="商品标题" thumb="https://img.yzcdn.cn/vant/ipad.jpeg" />

    <van-divider>Store(Pinia)用法</van-divider>
    <div class="item-panel text-c">
      <div class="mb-20">姓名：{{ otherStore.name }}</div>
      <van-cell-group inset class="mb-20">
        <van-field v-model="userName" label="姓名" placeholder="请输入姓名" />
      </van-cell-group>
      <van-button type="primary" @click="changeName">修改</van-button>
    </div>

    <van-divider></van-divider>
    <div class="item-panel text-c">
      <div class="mb-20">车牌号：{{ plate }}</div>
      <van-button type="primary" @click="plateVisible = true">选择车牌</van-button>
      <plate-keyboard v-model="plateVisible" @success="plateSuccess"></plate-keyboard>
    </div>

    <van-divider></van-divider>
    <div class="text-c">
      <van-button type="primary" @click="jump">列表页</van-button>
    </div>

    <van-divider></van-divider>
    <div class="text-c">
      <van-button type="primary" @click="refresh">刷新当前页</van-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Toast } from 'vant';
import { useOtherStore } from '@/store/otherStore';
import { useRouter } from 'vue-router';

import FeResult from '@/components/FeResult.vue';
import PlateKeyboard from '@/components/PlateKeyboard.vue';
import { refreshRouter } from '@/utils/utils';

const type = ref('info');
const typeChange = (val: string) => {
  type.value = val;
};

const searchVal = ref('');

const otherStore = useOtherStore();
const userName = ref('');
const changeName = () => {
  if (userName.value) {
    otherStore.setName(userName.value);
  } else {
    Toast('请输入姓名');
  }
};

const plate = ref('');
const plateVisible = ref(false);
const plateSuccess = (val: string) => {
  plate.value = val;
};

// 可以不用导入useRouter 插件会自动完成
const router = useRouter();
const jump = () => {
  router.push('/list');
};

const refresh = () => {
  refreshRouter();
};
</script>
<style lang="postcss">
.home-page {
  flex: 1 1 auto;
  .item-panel {
    background: #f7f8fa;
    padding: 20px 0;
    margin: 0 20px;
    border-radius: 10px;
  }
}
</style>
