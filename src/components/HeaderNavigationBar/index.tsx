import React from 'react';
import Taro from '@tarojs/taro';
import { ArrowLeft } from '@nutui/icons-react-taro';
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
  titleStyle?: React.CSSProperties;
  // 是否显示背景颜色
  showBg?: boolean;
  wrapStyle?: React.CSSProperties;
}

const HeaderNavigationBar: React.FC<IProps> = ({
  title,
  showBg,
  navigationBarLeft,
  titleStyle,
  wrapStyle,
}) => {
  const rectInfo = getMenuButtonBoundingClientRect();

  function handleBack() {
    if (Taro.getCurrentPages().length >= 2) {
      Taro.navigateBack();
    }
  }

  return (
    <View
      className={`${styles.headerNavigationWrap} ${showBg && styles.showBg}`}
      style={{
        paddingTop: rectInfo.top,
        height: rectInfo.height,
        ...(wrapStyle || {}),
      }}
    >
      {navigationBarLeft ? (
        <View className={styles.navigationBarLeft}>{navigationBarLeft}</View>
      ) : (
        <View className={styles.headerOperate}>
          <ArrowLeft size={18} color="#000000" onClick={handleBack} />
        </View>
      )}
      <Text className={styles.headerTitle} style={{ ...(titleStyle || {}) }}>
        {title}
      </Text>
    </View>
  );
};

export default HeaderNavigationBar;
