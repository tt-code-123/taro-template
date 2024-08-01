import Taro from '@tarojs/taro';
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

interface ResponseBase {
  /** data */
  data?: any;

  /** code */
  code?: string;

  /** message */
  message?: string;
}

const request = axios.create({
  baseURL: '/',
  timeout: 5000,
});

// Axios 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    config.headers['x-forwarded-host'] = config.baseURL;
    config.headers['saas-source'] = 'COS_WEB';
    config.headers['Authorization'] = '123456';

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Axios 返回拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ResponseBase>) => {
    const data = response.data;

    // 操作不成功时直接提示
    if (data.code !== '000000') {
      Taro.showToast({
        title: data.message!,
        icon: 'none',
        duration: 2000,
      });
      return Promise.reject(data.message);
    }

    return response;
  },
  ({ response }: AxiosError<ResponseBase>) => {
    if (response) {
      const { data } = response;
      const msg = data?.message;

      throw new Error(msg);
    } else {
      throw new Error('网络错误');
    }
  },
);

export default request;
