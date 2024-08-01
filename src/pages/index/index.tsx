import { useLoad } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import './index.scss';

export default function Index() {
  useLoad(() => {
    console.log('Page loaded.');
  });

  return (
    <View className="index">
      <Text>首页</Text>
    </View>
  );
}
