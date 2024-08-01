export default defineAppConfig({
  pages: ['pages/index/index', 'pages/mine/index'],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  tabBar: {
    list: [
      {
        iconPath: 'assets/images/home.png',
        selectedIconPath: 'assets/images/home_active.png',
        pagePath: 'pages/index/index',
        text: '首页',
      },
      {
        iconPath: 'assets/images/mine.png',
        selectedIconPath: 'assets/images/mine_active.png',
        pagePath: 'pages/mine/index',
        text: '我的',
      },
    ],
  },
});
