<template>
  <div class="layout-page">
    <router-view v-slot="{ Component, route }">
      <template v-if="Component">
        <transition
          :name="router.customRouterData?.transitionName"
          :css="routerAnimation"
          :duration="300"
          mode="out-in"
          appear
        >
          <keep-alive :max="10" :include="keepAliveRouter">
            <suspense>
              <component :is="Component" :key="route.name"></component>
            </suspense>
          </keep-alive>
        </transition>
      </template>
    </router-view>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '@/store/globalStore';

const router = useRouter();
const globalStore = useGlobalStore();

const keepAliveRouter = computed(() => globalStore.keepAliveRouter);
const routerAnimation = computed(() => globalStore.routerAnimation);
</script>

<style lang="postcss">
@import '@/assets/css/common.css';
@import '@/assets/css/reset.css';

/* 路由动画 */
.slide_left-enter-active,
.slide_left-leave-active,
.slide_right-enter-active,
.slide_right-leave-active {
  transition: all 0.3s;
  position: absolute !important;
  background-color: white;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1;
}

.slide_left-enter-from,
.slide_right-leave-to {
  opacity: 1;
  transform: translateX(100%);
}

.slide_right-enter-from,
.slide_left-leave-to {
  opacity: 1;
  transform: translateX(-100%);
}

.slide_left-leave-to,
.slide_right-leave-to {
  opacity: 0.3;
}
</style>
