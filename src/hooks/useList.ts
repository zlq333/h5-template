import { ref, reactive, nextTick } from 'vue';
import useAxios from '@/utils/useAxios';
import { isArray, isObject } from '@fe/utils';

// 泛型参数T  表示list内的具体结构
export default function useList<T = any, S = ListOptions>(config: UseListConfig<S>) {
  // 支持参数如下
  // const defaultOptions:useListConfig = {
  //   listOptions: {},// 表格查询条件
  //   axiosConfig:{}, // 表格发送请求的配置(同axios配置)
  //   beforeSearch: null, // 查询前拦截器 可用于校验参数 校验不通过请返回false
  //   beforeFetchData: null, // 发送请求前钩子 可用于处理send参数 不通过请返回false
  //   beforeResolve: null // 请求完成后钩子 可对源数据进行处理
  // };

  const listState = reactive<ListState>({
    loading: false,
    finished: false,
    refresh: false,
    error: false
  });

  // 记录原始listOptions
  const oldOptions = { ...config.listOptions };
  // 表格数据源
  const listData = ref<T[]>([]);
  // 列表扩展参数
  const extendData = ref<any>({});
  // 请求参数
  const sendOptions = reactive({});
  // 分页对象
  const pagination = reactive<Pagination>({
    page: 0,
    pageSize: 10, //每页中显示10条数据
    total: 0
  });

  // 重置查询参数
  const resetOption = (reload = true) => {
    Object.keys(config.listOptions).forEach(key => {
      config.listOptions[key] = oldOptions[key];
    });
    if (reload) onRefresh();
  };

  // 查询前 校验参数
  const validParams = (): boolean => {
    let valid = true;
    if (config.beforeSearch) {
      valid = config.beforeSearch();
    }
    if (!valid) return false;

    Object.keys(config.listOptions).forEach(key => {
      sendOptions[key] = config.listOptions[key];
    });
    return true;
  };
  // 上拉 加载更多 进入页面就会触发一次onLoad
  const onLoad = async (isReLoad: boolean = false) => {
    if (validParams()) {
      if (isReLoad) {
        pagination.page = 1;
      } else {
        pagination.page++;
      }
      listState.loading = true;
      fetchData();
    }
  };
  // 下拉刷新
  const onRefresh = async () => {
    // 查询前 校验参数
    if (validParams()) {
      listState.finished = false;
      listState.refresh = true;
      pagination.page = 1;
      fetchData(true);
    }
  };

  // 发送查询请求
  const fetchData = async (isRefresh: boolean = false) => {
    let options = JSON.parse(
      JSON.stringify({ pageNum: pagination.page, pageSize: pagination.pageSize, ...sendOptions })
    );

    // 发送请求前 可以执行beforeFetchData钩子
    let valid = true;
    if (config.beforeFetchData) {
      valid = config.beforeFetchData(options);
    }
    if (!valid) return;
    // 处理请求参数
    let sendConfig = JSON.parse(JSON.stringify(config.axiosConfig));
    const method = (config.axiosConfig.method || 'get').toLowerCase();
    // 合并请求参数 仅支持get、delete、post、put
    // 其他方式下options将覆盖config.axiosConfig.params、config.axiosConfig.data
    if (method === 'get' || method === 'delete') {
      if (isArray(config.axiosConfig.params)) {
        sendConfig.params = [...(config.axiosConfig.params || []), ...options];
      } else if (isObject(config.axiosConfig.params)) {
        sendConfig.params = { ...(config.axiosConfig.params || {}), ...options };
      } else {
        sendConfig.params = options;
      }
    }
    if (method === 'post' || method === 'put') {
      if (isArray(config.axiosConfig.params)) {
        sendConfig.data = [...(config.axiosConfig.data || []), ...options];
      } else if (isObject(config.axiosConfig.params)) {
        sendConfig.data = { ...(config.axiosConfig.data || {}), ...options };
      } else {
        sendConfig.data = options;
      }
    }

    // 发送请求
    let result: any;
    try {
      result = await useAxios(sendConfig);
    } catch (error) {
      listState.error = true;
      listState.loading = false;
      listState.finished = true;
      listState.refresh = false;
      return;
    }
    if (config.beforeResolve) {
      valid = config.beforeResolve(result); // 请求完成回调
    }

    if (!valid) return;
    // 处理状态
    if (isRefresh) {
      listState.refresh = false;
      listData.value = result.list || [];
      extendData.value = result || {};
    } else {
      if (pagination.page === 1) {
        listData.value = [];
      }
      listData.value = [...listData.value, ...result.list];
      listState.loading = false;
      // 判断是否加载完成
      if (result.list.length >= pagination.pageSize) {
        listState.finished = false;
      } else {
        listState.finished = true;
      }
    }
    pagination.total = result.total || 0;
    extendData.value = result || {};
  };

  return {
    listData,
    listState,
    extendData,
    sendOptions,
    pagination,
    onLoad,
    onRefresh,
    resetOption
  };
}
