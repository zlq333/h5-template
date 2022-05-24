<template>
  <van-popup v-model:show="visible" position="bottom" safe-area-inset-bottom @close="closePopup" @closed="closedPopup">
    <div class="plate-container">
      <div class="plate-topbar-box">
        <div class="plate-topbar-text">{{ title }}</div>
        <div class="plate-complete" @click="confrim">完成</div>
      </div>
      <div class="plate-val-box">
        <template v-for="(val, ind) in plateList" :key="ind">
          <div
            v-if="ind === 7"
            class="plate-val-item"
            :class="[{ 'last-item': plateList[7] === '' }, { active: currentLength === ind }]"
          >
            <van-icon v-if="val === ''" name="plus" />
            <template v-else> {{ val }} </template>
          </div>
          <div v-else class="plate-val-item" :class="{ active: currentLength === ind }">{{ val }}</div>
        </template>
      </div>
      <div v-if="keyboardType === 0" class="chinese-input-box">
        <div class="plate-chinese-con">
          <div
            class="plate-chinese-item-warp"
            v-for="(val, ind) in chineseOptions.list1"
            :key="ind"
            @click="inputChangeChinese(val)"
          >
            <div class="plate-chinese-item van-hairline--surround">{{ val.name }}</div>
          </div>
        </div>
        <div class="plate-chinese-con">
          <div
            class="plate-chinese-item-warp"
            v-for="(val, ind) in chineseOptions.list2"
            :key="ind"
            @click="inputChangeChinese(val)"
          >
            <div class="plate-chinese-item van-hairline--surround">{{ val.name }}</div>
          </div>
        </div>
        <div class="plate-chinese-con">
          <div
            class="plate-chinese-item-warp"
            v-for="(val, ind) in chineseOptions.list3"
            :key="ind"
            @click="inputChangeChinese(val)"
          >
            <div class="plate-chinese-item van-hairline--surround">{{ val.name }}</div>
          </div>
        </div>
        <div class="plate-chinese-con">
          <div
            class="plate-chinese-item-warp"
            v-for="(val, ind) in chineseOptions.list4"
            :key="ind"
            @click="inputChangeChinese(val)"
          >
            <div class="plate-chinese-item van-hairline--surround" :class="{ 'del-back': val.id == 99 }">
              {{ val.name }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="keyboardType === 1" class="ennumber-input-panel">
        <div class="plate-ennumber-con">
          <div
            class="plate-ennumber-item-warp"
            v-for="(val, ind) in englishOptions.list1"
            :key="ind"
            @click="inputChangeEnNumber(val)"
          >
            <div class="plate-ennumber-item van-hairline--surround" :class="{ disabled: plateList[1] == '' }">
              {{ val.name }}
            </div>
          </div>
        </div>
        <div class="plate-ennumber-con">
          <div
            class="plate-ennumber-item-warp"
            v-for="(val, ind) in englishOptions.list2"
            :key="ind"
            @click="inputChangeEnNumber(val)"
          >
            <div class="plate-ennumber-item van-hairline--surround">{{ val.name }}</div>
          </div>
        </div>
        <div class="plate-ennumber-con">
          <div
            class="plate-ennumber-item-warp"
            v-for="(val, ind) in englishOptions.list3"
            :key="ind"
            @click="inputChangeEnNumber(val)"
          >
            <div class="plate-ennumber-item van-hairline--surround">{{ val.name }}</div>
          </div>
        </div>
        <div class="plate-ennumber-con">
          <div
            class="plate-ennumber-item-warp"
            v-for="(val, ind) in englishOptions.list4"
            :key="ind"
            @click="inputChangeEnNumber(val)"
          >
            <div
              class="plate-ennumber-item van-hairline--surround"
              :class="[{ 'del-back': val.id == 99 }, { disabled: val.id == 98 && plateList[5] === '' }]"
            >
              {{ val.name }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script lang="ts">
import { ref, watch, defineComponent } from 'vue';
import { plate } from '@fe/validator';
import { Toast } from 'vant';
export default defineComponent({
  props: {
    modelValue: {
      required: false,
      type: Boolean,
      default: false
    },
    // 关闭时 是否清除已输入数据
    closedClear: {
      required: false,
      type: Boolean,
      default: true
    },
    // 默认显示的车牌号 仅在open时有效
    defaultValue: {
      required: false,
      type: String,
      default: ''
    },
    title: {
      required: false,
      type: String,
      default: '车牌号'
    }
  },
  emits: ['update:modelValue', 'change', 'success', 'close'],
  setup(props: any, { emit }: any) {
    const visible = ref(false);

    const plateList = ref(['', '', '', '', '', '', '', '']); // 允许输入多少位 默认7位 新能源车型8位
    const keyboardType = ref(0); // 0中文键盘  1英文键盘
    let currentLength = ref(0); // 当前已输入多少位

    // 中文键盘选项
    const chineseOptions = {
      list1: [
        { name: '京', id: 1 },
        { name: '津', id: 2 },
        { name: '冀', id: 3 },
        { name: '鲁', id: 4 },
        { name: '晋', id: 5 },
        { name: '蒙', id: 6 },
        { name: '辽', id: 7 },
        { name: '吉', id: 8 },
        { name: '黑', id: 9 },
        { name: '泸', id: 10 }
      ],
      list2: [
        { name: '苏', id: 11 },
        { name: '浙', id: 12 },
        { name: '皖', id: 13 },
        { name: '闽', id: 14 },
        { name: '赣', id: 15 },
        { name: '豫', id: 16 },
        { name: '鄂', id: 17 },
        { name: '湘', id: 18 },
        { name: '粤', id: 19 },
        { name: '桂', id: 20 }
      ],
      list3: [
        { name: '渝', id: 21 },
        { name: '川', id: 22 },
        { name: '贵', id: 23 },
        { name: '云', id: 24 },
        { name: '藏', id: 25 },
        { name: '陕', id: 26 },
        { name: '甘', id: 27 },
        { name: '青', id: 28 },
        { name: '琼', id: 29 },
        { name: '新', id: 30 }
      ],
      list4: [
        { name: '宁', id: 31 },
        { name: '港', id: 32 },
        { name: '澳', id: 33 },
        { name: '台', id: 34 },
        { name: '', id: 99 }
      ]
    };
    // 英文键盘选项
    const numberOptions = [
      { name: '1', id: 1 },
      { name: '2', id: 2 },
      { name: '3', id: 3 },
      { name: '4', id: 4 },
      { name: '5', id: 5 },
      { name: '6', id: 6 },
      { name: '7', id: 7 },
      { name: '8', id: 8 },
      { name: '9', id: 9 },
      { name: '0', id: 10 }
    ];
    // 数字键盘选项
    const englishOptions = {
      list1: [
        { name: '1', id: 1 },
        { name: '2', id: 2 },
        { name: '3', id: 3 },
        { name: '4', id: 4 },
        { name: '5', id: 5 },
        { name: '6', id: 6 },
        { name: '7', id: 7 },
        { name: '8', id: 8 },
        { name: '9', id: 9 },
        { name: '0', id: 10 }
      ],
      list2: [
        { name: 'A', id: 11 },
        { name: 'B', id: 12 },
        { name: 'C', id: 13 },
        { name: 'D', id: 14 },
        { name: 'E', id: 15 },
        { name: 'F', id: 16 },
        { name: 'G', id: 17 },
        { name: 'H', id: 18 },
        { name: 'J', id: 19 }
      ],
      list3: [
        { name: 'K', id: 20 },
        { name: 'L', id: 21 },
        { name: 'M', id: 22 },
        { name: 'N', id: 23 },
        { name: 'P', id: 24 },
        { name: 'Q', id: 25 },
        { name: 'R', id: 26 },
        { name: 'S', id: 27 },
        { name: 'T', id: 28 }
      ],
      list4: [
        { name: 'U', id: 29 },
        { name: 'V', id: 30 },
        { name: 'W', id: 31 },
        { name: 'X', id: 32 },
        { name: 'Y', id: 33 },
        { name: 'Z', id: 34 },
        { name: '挂', id: 98 },
        { name: '', id: 99 }
      ]
    };

    watch(
      () => props.modelValue,
      (newVal, oldVal) => {
        if (newVal === true) {
          openPopup();
        } else {
          closePopup();
        }
      }
    );

    // 打开弹层 会执行初始化
    const openPopup = () => {
      plateList.value = ['', '', '', '', '', '', '', ''];
      currentLength.value = 0;
      keyboardType.value = 0;

      // 回填默认值
      if (props.defaultValue) {
        // 校验车牌是否合法
        if (plate(props.defaultValue)) {
          let _plate = props.defaultValue.split('');
          if (_plate.length === 7) _plate.push('');

          plateList.value = _plate;
          keyboardType.value = 1;
          currentLength.value = _plate.length;
        } else {
          console.warn(`defaultValue:${props.defaultValue} 车牌号不合法`);
        }
      }

      visible.value = true;
    };
    // 关闭弹层
    const closePopup = () => {
      visible.value = false;
      emit('update:modelValue', false);
    };
    // 关闭完成后 清除已输入
    const closedPopup = () => {
      if (props.closedClear) {
        plateList.value = ['', '', '', '', '', '', '', ''];
      }
      emit('close');
    };

    // 判断是否切换回中文键盘
    const isShowChinese = () => {
      // 第一位为空则切回中文键盘
      if (plateList.value[0] === '') {
        keyboardType.value = 0;
      }
    };
    // 中文输入
    const inputChangeChinese = (val: { name: string; id: number }) => {
      if (val.id === 99) return;
      keyboardType.value = 1;
      currentLength.value++;
      plateList.value.splice(0, 1, val.name);
      emit('change', plateList.value.join(''));
    };
    // 英文、数字输入
    const inputChangeEnNumber = (val: { name: string; id: number }) => {
      // 99代表删除
      if (val.id === 99) {
        currentLength.value--;
        plateList.value.splice(currentLength.value, 1, '');
        isShowChinese(); // 是否显示中文键盘
      } else {
        if (plateList.value[7] !== '') return; // 最大输入8位

        let numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        // 第二位不允许是数字
        if (plateList.value.join('').length === 1 && numArr.indexOf(val.name) !== -1) {
          return;
        }
        plateList.value.splice(currentLength.value, 1, val.name);
        currentLength.value++;
        emit('change', plateList.value.join(''));
      }
    };

    const confrim = () => {
      const palteNumber = plateList.value.join('');
      if (!palteNumber) {
        Toast('请输入车牌号');
        return;
      }
      // 校验车牌号位数
      if (palteNumber.length < 7) {
        Toast('车牌号不正确');
        return;
      }
      closePopup();
      emit('success', palteNumber);
    };
    return {
      keyboardType,
      plateList,
      currentLength,
      visible,
      chineseOptions,
      englishOptions,
      numberOptions,
      openPopup,
      closePopup,
      closedPopup,
      isShowChinese,
      inputChangeChinese,
      inputChangeEnNumber,
      confrim
    };
  }
});
</script>
<style lang="postcss" scoped>
.plate-container {
  position: relative;
  left: 0;
  bottom: 0;
  background: #fff;
  width: 100%;
  font-size: 16px;
  color: #333;
  user-select: none;
}
.plate-topbar-box {
  text-align: center;
  background: #fff;
  border-bottom: 1px solid #e9e9e9;
  position: relative;
  box-sizing: border-box;
  .plate-topbar-text {
    width: 100vw;
    height: 100px;
    line-height: 100px;
    font-size: 32px;
  }

  .plate-complete {
    position: absolute;
    right: 26px;
    top: 26px;
    font-size: 30px;
    color: var(--base-color);
  }
}

.plate-val-box {
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 60px 0;
  box-sizing: border-box;

  .plate-val-item {
    width: 60px;
    height: 80px;
    border: 1px solid #d5d5d5;
    line-height: 80px;
    border-radius: 8px;
    margin: 0 8px 0;
    text-align: center;
    font-size: 32px;
    transition: border color background 0.3s;
  }
  .plate-val-item:nth-child(2) {
    margin-right: 40px;
  }
  .plate-val-item.active {
    border-color: var(--base-color);
  }
  .plate-val-item.last-item {
    border: 1px dashed #d5d5d5;
    font-size: 38px;
    color: #d5d5d5;
    .van-icon {
      position: relative;
      left: 1px;
      top: 2px;
    }
  }
}

.chinese-input-box {
  padding: 0 10px 50px 10px;
  .plate-chinese-con {
    display: flex;
    padding: 0 15px;
    margin-bottom: 15px;
    justify-content: center;
  }
  .plate-chinese-item-warp {
    flex: 0 0 auto;
    padding: 0 5px;
  }
  .plate-chinese-item {
    text-align: center;
    width: 61px;
    height: 82px;
    line-height: 82px;
    font-size: 34px;
    background: #fff;
    color: #333333;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .plate-chinese-item::after {
    border-radius: 8px;
  }
  .plate-chinese-item:active {
    background: var(--base-color);
    color: #fff;
  }
  .plate-chinese-item:active::after {
    border: 0 solid var(--base-color);
  }
}

.ennumber-input-panel {
  padding: 0 10px 50px 10px;
  .plate-ennumber-con {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
  }
  .plate-ennumber-item-warp {
    flex: 0 0 auto;
    padding: 0 5px;
  }
  .plate-ennumber-item {
    text-align: center;
    width: 61px;
    height: 82px;
    line-height: 82px;
    font-size: 36px;
    border-radius: 8px;
    box-sizing: border-box;
  }
  .plate-ennumber-item::after {
    border-radius: 8px;
  }
  .plate-ennumber-item:active {
    background: var(--base-color);
    color: #fff;
  }
  .plate-ennumber-item:active::after {
    border: 0 solid var(--base-color);
  }
  .plate-ennumber-item.disabled {
    background: #f1f2f3;
    color: #cccccc;
  }
}
.plate-chinese-item.del-back,
.plate-ennumber-item.del-back {
  width: 137px;
  height: 82px;
  box-sizing: border-box;
  background: url('../assets/img/spaceback.png') no-repeat center center;
  background-size: 45px 32px;
  transition: none;
}
</style>
