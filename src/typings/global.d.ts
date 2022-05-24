declare module 'html2pdf.js';
declare let wx;
declare class VConsole {}

// config数据结构定义
interface Config {
  publicKey?: string;
  baseURL: string;
  uploadURL: string;
  tokenKey: string;
  isWeixin: boolean;
  wxConfig: {
    checkAuthor: boolean;
    appId: string;
    redirectUrl: string;
  };
  system: {
    permission: boolean;
    keepAlive: boolean;
    name: string;
  };
}

interface AxiosResponseData<T = any> {
  code?: number;
  error?: string;
  message?: string;
  data?: T;
}

interface UseListConfig<S extends ListOptions> {
  listOptions: S;
  axiosConfig: AxiosRequestConfig;
  beforeSearch?: () => boolean;
  beforeFetchData?: (options: any) => boolean;
  beforeResolve?: (options: any) => boolean;
}

interface ListState {
  loading: boolean;
  finished: boolean;
  refresh: boolean;
  error: boolean;
}

interface ListOptions {
  [prop: string]: any;
}

interface Pagination {
  page: number;
  pageSize: number;
  total?: number;
}
interface ListResult {
  count: number;
  list: any[];
}
interface DictAll {
  [prop: string]: Dict[];
}
interface Dict {
  id: number;
  dictId?: string;
  label: string;
  value: string;
  remark?: string;
  sort?: number;
  type?: string;
  typeLabel?: string;
  createTime?: string;
  updateTime?: string;
}
