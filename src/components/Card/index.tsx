import React from 'react';
import { View } from '@tarojs/components';

import styles from './index.module.less';

interface IProps {
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}

const Card: React.FC<React.PropsWithChildren<IProps>> = ({
  headerLeft,
  headerRight,
  className,
  children,
}) => {
  return (
    <View className={`${styles.cardWrap} ${className || ''}`}>
      {headerLeft || headerRight ? (
        <View className={styles.cardHeader}>
          <View>{headerLeft || null}</View>
          <View>{headerRight || null}</View>
        </View>
      ) : null}
      {children}
    </View>
  );
};

export default Card;
