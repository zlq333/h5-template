import projectConfig from '@/config/config';
import other from './other';

const baseURL = projectConfig.baseURL;
let baseApi: any = {};
baseApi.baseURL = baseURL;

// 图片上传
baseApi.upload = projectConfig.uploadURL + '/common/api/file/upload';

// 导出全部api
let api = { ...baseApi, ...other };

export default api;
