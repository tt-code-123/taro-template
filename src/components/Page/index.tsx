import React, { isValidElement } from 'react';
import { View } from '@tarojs/components';

import HeaderNavigationBar from '@/components/HeaderNavigationBar';
import { getNavHeight, getWindowHeight } from '@/utils';

import styles from './index.module.less';

interface IProps {
  /**
   * 导航栏标题文字内容
   */
  navigationBarTitle?: string;
  /**
   * 导航栏左侧内容
   */
  navigationBarLeft?: React.ReactElement;
  /**
   * 导航栏
   */
  headerNavigationBar?: React.ReactElement;
  /**
   * 是否展示tabBar
   */
  showTabBar?: boolean;
  className?: string;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
}

const Page: React.FC<React.PropsWithChildren<IProps>> = ({
  className,
  style,
  children,
  showTabBar = true,
  headerNavigationBar,
  navigationBarLeft,
  navigationBarTitle,
  contentStyle,
}) => {
  const windowHeight = getWindowHeight(showTabBar);
  const navHeight = getNavHeight();

  return (
    <View
      style={{ height: windowHeight, ...(style || {}) }}
      className={`${styles.container} ${className || ''}`}
    >
      {isValidElement(headerNavigationBar) ? (
        headerNavigationBar
      ) : navigationBarTitle ? (
        <HeaderNavigationBar navigationBarLeft={navigationBarLeft} title={navigationBarTitle} />
      ) : null}
      <View
        style={{
          marginTop: navHeight,
          height: windowHeight - navHeight,
          ...(contentStyle || {}),
        }}
      >
        {children}
      </View>
    </View>
  );
};

export default Page;
