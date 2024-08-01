import React from 'react';
import { useLoad } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

interface IProps {}

const Mine: React.FC<IProps> = () => {
  useLoad(() => {
    console.log('Page 我的.');
  });

  return (
    <View className="index">
      <Text>我的</Text>
    </View>
  );
};

export default Mine;
