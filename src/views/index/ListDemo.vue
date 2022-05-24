<template>
  <van-pull-refresh v-model="listState.refresh" @refresh="onRefresh">
    <van-list
      v-model:loading="listState.loading"
      :finished="listState.finished"
      :error="listState.error"
      :class="{ 'list-empty': !listData || listData.length === 0 }"
      :immediate-check="false"
      error-text="加载失败"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-if="listData && listData.length" class="list">
        <div class="list-item" v-for="el in listData">{{ el.name }}</div>
      </div>
      <van-empty v-else image-size="200" description="暂无数据"> </van-empty>
    </van-list>
  </van-pull-refresh>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import useList from '@/hooks/useList';
import api from '@/api/api';

interface ListData {
  id: string;
  name: string;
}

interface ListOptions {
  startTime: string;
  endTime: string;
}

const listOptions = reactive<ListOptions>({
  startTime: '',
  endTime: ''
});

// 使用useList
const { listState, listData, onLoad, onRefresh } = useList<ListData, ListOptions>({
  listOptions,
  axiosConfig: { url: api.getOrderList, method: 'post' }
});
onLoad();
</script>
<style lang="postcss"></style>
