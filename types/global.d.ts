/// <reference types="@tarojs/taro" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv {
    /** NODE 内置环境变量, 会影响到最终构建生成产物 */
    NODE_ENV: 'development' | 'production';
    /** 当前构建的平台 */
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
    /**
     * 当前构建的小程序 appid
     * @description 若不同环境有不同的小程序，可通过在 env 文件中配置环境变量`TARO_APP_ID`来方便快速切换 appid， 而不必手动去修改 dist/project.config.json 文件
     * @see https://taro-docs.jd.com/docs/next/env-mode-config#特殊环境变量-taro_app_id
     */
    TARO_APP_ID: string;
    /** 静态资源服务器地址 */
    TARO_APP_STATIC_URL: string;
    /** 接口请求地址 */
    TARO_APP_REQUEST_URL: string;
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'wx-open-launch-weapp': any; // You can specify the props here if needed
    'grid-scroll-view': {
      id?: string;
      /**
       * 交叉轴元素数量
       */
      crossAxisCount?: number;
      /**
       * 交叉轴方向间隔
       */
      crossAxisGap?: number;
      /**
       * 主轴方向间隔
       */
      mainAxisGap?: number;
      /**
       * 滚动高度
       */
      height: number;
      /**
       * 距底部多远时，触发 scrolltolower 事件
       */
      lowerThreshold?: number;
      /**
       * 默认分页条数
       */
      defaultPageSize?: number;
      /**
       * 滚动时触发
       */
      onScroll?: (e) => void;
      /**
       * 获取数据
       */
      onRequest: (params: {
        detail: {
          pageSize: number;
          pageCurrent: number;
          onSuccess: (val: any) => void;
          onError: () => void;
        };
      }) => Promise<any>;
    };
  }
}
