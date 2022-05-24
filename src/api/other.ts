import projectConfig from '@/config/config';
const baseURL = projectConfig.baseURL;
let api: any = {};

// 查询订单列表
api.getOrderList = baseURL + '/order/page';

export default api;
