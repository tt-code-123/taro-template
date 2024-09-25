import React, { useEffect, useRef } from 'react';
import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import { isWeChatBrowser } from '@/utils';

const pxTransform = (size) => {
  if (!size) {
    return;
  }
  return parseFloat(Taro.pxTransform(size));
};

interface IMiniOpenButton {
  className?: string;
  children: React.ReactNode;
  /**目标小程序的appid,必填 */
  appid: string;
  /**目标小程序的页面路径,非必填 */
  path?: string;
  /**触发按钮的宽度，h5必传 */
  width?: number;
  /**触发按钮的高度，h5必传 */
  height?: number;
  /**微信sdk是否已经初始完成，h5必传 */
  isInitWX?: number;
  /**跳转目标程序携带的参数 JSON字符串格式 */
  extraData?: object;
  /**是否能半屏跳转 */
  embedded?: boolean;
  /**是否携带token跳转 */
  needToken?: boolean;
}
declare const wx: any;
/**
 * 小程序跳转组件
 */
const MiniOpenButton: React.FC<IMiniOpenButton> = ({
  className,
  children,
  path,
  appid,
  width,
  height, // 必传，因为button与children同级，且定位（覆盖）在children之上，经过微信初始化后不可使用100%
  isInitWX,
  needToken = false,
  embedded = true,
}) => {
  const lunchRef = useRef<any>();
  const isWechat = useRef(isWeChatBrowser());
  const isLoadingRef = useRef(false);

  useEffect(() => {
    if (!isInitWX) {
      return;
    }
    // 初始化完成后
    const lunchDom = lunchRef.current;
    lunchDom?.addEventListener('ready', readyHandel);
    lunchDom?.addEventListener('launch', launchHandel);
    lunchDom?.addEventListener('error', errorHandel);
    return () => {
      lunchDom?.removeEventListener('ready', readyHandel);
      lunchDom?.removeEventListener('launch', launchHandel);
      lunchDom?.removeEventListener('error', errorHandel);
    };
  }, [isInitWX]);

  const launchHandel = (e) => {
    console.log('跳转小程序成功：', e.detail);
  };

  const errorHandel = (e) => {
    console.log('跳转小程序失败：', e.detail);
  };

  const readyHandel = () => {
    console.log('跳转小程序准备完成');
  };

  const onClick = () => {
    if (isLoadingRef.current) {
      return;
    }
    const ENV_TYPE = Taro.getEnv();
    // 小程序环境
    if (ENV_TYPE === 'WEAPP') {
      isLoadingRef.current = true;
      let extraData = {};
      if (needToken) {
        const token = Taro.getStorageSync('token');
        if (!token) {
          Taro.showModal({
            title: '提示',
            content: '您还没登录，是否需要登录',
            success: (res) => {
              console.log(res);
              if (res.confirm) {
                Taro.navigateTo({
                  url: '/pages/login/index',
                });
              }
            },
            complete() {
              isLoadingRef.current = false;
            },
          });
          return;
        }
        extraData = {
          token: Taro.getStorageSync('token'),
        };
      }
      const accountInfo = wx.getAccountInfoSync();
      const envVersion = accountInfo.miniProgram.envVersion;
      console.log(envVersion, '====');
      if (embedded) {
        Taro.openEmbeddedMiniProgram({
          appId: appid,
          path,
          extraData,
          envVersion,
          allowFullScreen: true,
          noRelaunchIfPathUnchanged: false,
          complete() {
            isLoadingRef.current = false;
          },
        });
      } else {
        Taro.navigateToMiniProgram({
          appId: appid,
          path,
          extraData,
          envVersion: 'release',
          complete() {
            isLoadingRef.current = false;
          },
        });
      }
      return;
    }
    // web环境且非微信浏览器
    if (ENV_TYPE === 'WEB' && !isWechat.current) {
      Taro.showToast({ title: '请使用微信打开当前链接~', icon: 'none' });
    }
  };

  /** 非微信浏览器 */
  if (!isWechat.current) {
    return (
      <View style={{ position: 'relative' }} className={className} onClick={onClick}>
        {children}
      </View>
    );
  }
  return (
    <View style={{ position: 'relative' }} className={className}>
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          margin: 0,
          padding: 0,
          left: 0,
          right: 0,
          top: 0,
          bottom: '',
          opacity: 0,
          zIndex: 2,
        }}
      >
        <wx-open-launch-weapp
          ref={lunchRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
          appid={appid}
          env-version="release"
          path={path}
        >
          <script type="text/wxtag-template">
            <button
              style={{
                display: 'block',
                width: pxTransform(width),
                height: pxTransform(height),
              }}
            ></button>
          </script>
        </wx-open-launch-weapp>
      </View>
      {children}
    </View>
  );
};
export default MiniOpenButton;
