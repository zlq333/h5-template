<template>
  <div class="el-result">
    <div class="el-result__icon">
      <slot name="icon">
        <component :is="iconElement" :class="iconElement" />
      </slot>
    </div>
    <div v-if="title || $slots.title" class="el-result__title">
      <slot name="title">
        <p>{{ title }}</p>
      </slot>
    </div>
    <div v-if="subTitle || $slots.subTitle" class="el-result__subtitle">
      <slot name="subTitle">
        <p>{{ subTitle }}</p>
      </slot>
    </div>
    <div v-if="$slots.extra" class="el-result__extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>
<script lang="ts">
// 源自element-plus Result组件
import { computed, defineComponent } from 'vue';
import IconSuccess from './svg-img/icon-success.vue';
import IconError from './svg-img/icon-error.vue';
import IconWarning from './svg-img/icon-warning.vue';
import IconInfo from './svg-img/icon-info.vue';

const IconMap = {
  success: 'icon-success',
  warning: 'icon-warning',
  error: 'icon-error',
  info: 'icon-info'
};

export default defineComponent({
  name: 'FeResult',
  components: {
    [IconSuccess.name]: IconSuccess,
    [IconError.name]: IconError,
    [IconWarning.name]: IconWarning,
    [IconInfo.name]: IconInfo
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: 'icon-info'
    }
  },
  setup(props) {
    const iconElement = computed(() => {
      const icon = props.icon;
      return icon && IconMap[icon] ? IconMap[icon] : 'icon-info';
    });

    return {
      iconElement
    };
  }
});
</script>
<style scoped>
.el-result {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  box-sizing: border-box;
  padding: 80px 60px;
}
.el-result__icon svg {
  width: 128px;
  height: 128px;
}
.el-result__title p {
  margin: 40px 0 0 0;
  font-size: 40px;
  color: #303133;
  line-height: 1.3;
}
.el-result__subtitle {
  margin-top: 20px;
}
.el-result__subtitle p {
  margin: 0;
  font-size: 28px;
  color: #606266;
  line-height: 1.3;
}
.el-result__extra {
  margin-top: 60px;
}
.el-result .icon-success {
  fill: #67c23a;
}
.el-result .icon-error {
  fill: #f56c6c;
}
.el-result .icon-info {
  fill: #909399;
}
.el-result .icon-warning {
  fill: #e6a23c;
}
</style>
