import Taro from '@tarojs/taro';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { envConfig } from '@/config';

import { judgePlatform } from '..';

interface ResponseBase<T = any> {
  /** data */
  data?: T;

  /** code */
  code?: string;

  /** message */
  message?: string;
}

class Request {
  private request: AxiosInstance;
  constructor() {
    const request = axios.create({
      baseURL: judgePlatform('weapp') ? envConfig.requestURL : './',
      timeout: 5000,
    });

    // Axios 请求拦截器
    request.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        config.headers['Content-Type'] = 'application/json;charset=utf-8';
        config.headers['x-forwarded-host'] = config.baseURL;
        config.headers['saas-source'] = 'COS_MINIAPP';

        const token = Taro.getStorageSync('token');
        if (token) {
          config.headers['saas-token'] = token;
        }

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

        // token失效
        if (data.code === '401') {
          Taro.showToast({
            title: data.message!,
            icon: 'none',
            duration: 2000,
          });
          Taro.removeStorageSync('token');
          Taro.redirectTo({
            url: '/pages/login/index',
          });
          return;
        }

        // 操作不成功时直接提示
        if (data.code !== '000000') {
          Taro.showToast({
            title: data.message!,
            icon: 'none',
            duration: 2000,
          });
          return Promise.reject(response);
        }

        return data.data || data;
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
    this.request = request;
  }
  get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request.get<ResponseBase, ResponseBase<T>['data']>(url, config);
  }

  post<T = any>(url: string, data?: object, config?: AxiosRequestConfig) {
    return this.request.post<ResponseBase, ResponseBase<T>['data']>(url, data, config);
  }

  put<T = any>(url: string, data?: object, config?: AxiosRequestConfig) {
    return this.request.put<ResponseBase, ResponseBase<T>['data']>(url, data, config);
  }

  delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.request.delete<T>(url, config);
  }

  patch<T = any>(url: string, data?: object, config?: AxiosRequestConfig) {
    return this.request.patch<T>(url, data, config);
  }
}

export default new Request();
