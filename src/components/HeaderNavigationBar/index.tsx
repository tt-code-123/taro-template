import React from 'react';
import Taro from '@tarojs/taro';
import { ArrowLeft, Home } from '@nutui/icons-react-taro';
import { View, Text } from '@tarojs/components';

import { getMenuButtonBoundingClientRect } from '@/utils';

import styles from './index.module.less';

interface IProps {
  /**
   * 导航栏标题文字内容
   */
  title: string;
  /**
   * 导航栏左侧内容
   */
  navigationBarLeft?: React.ReactElement;
}

const HeaderNavigationBar: React.FC<IProps> = ({ title, navigationBarLeft }) => {
  const rectInfo = getMenuButtonBoundingClientRect();

  function handleBack() {
    if (Taro.getCurrentPages().length >= 2) {
      Taro.navigateBack();
    }
  }

  function handleGoHome() {
    Taro.switchTab({
      url: '/pages/home/index',
    });
  }

  return (
    <View
      className={styles.headerNavigationWrap}
      style={{ marginTop: rectInfo.top, height: rectInfo.height }}
    >
      {navigationBarLeft ? (
        <View className={styles.navigationBarLeft}>{navigationBarLeft}</View>
      ) : (
        <View className={styles.headerOperate}>
          <ArrowLeft size={16} color="rgba(0, 0, 0, 0.90)" onClick={handleBack} />
          <View className={styles.divider} />
          <Home size={16} color="rgba(0, 0, 0, 0.90)" onClick={handleGoHome} />
        </View>
      )}
      <Text className={styles.headerTitle}>{title}</Text>
    </View>
  );
};

export default HeaderNavigationBar;
