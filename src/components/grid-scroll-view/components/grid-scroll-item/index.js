/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object,
      value: {},
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    itemData: {},
    homeImg: '',
    isVideo: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleLike() {
      const { itemData } = this.data;
      const that = this;
      const mutation = `
        mutation toggleArtworkLike($input: BigIntString!) {
          toggleArtworkLike(input: $input)
        }
      `;
      wx.request({
        url: 'http://localhost:3005/graphql',
        data: {
          query: mutation,
          variables: {
            input: itemData.id,
          },
        },
        method: 'POST',
        header: {
          'content-type': 'application/json',
          authorization: `Bearer ${wx.getStorageSync('zhiya-weapp_0.0.1_user').state.token}`,
        },
        success() {
          that.setData({
            itemData: {
              ...itemData,
              liked: !itemData.liked,
              likeCount: itemData.likeCount + (itemData.liked ? -1 : 1),
            },
          });
        },
      });
      return false;
    },
    handleNavigation() {
      // eslint-disable-next-line no-undef
      wx.navigateTo({
        url: `/pages/note-details/index?id=${this.properties.item.id}`,
      });
    },
  },
  observers: {
    item(val) {
      const pixelRatio = wx.getWindowInfo;
      this.setData({
        itemData: val,
        homeImg: `${val.homeImg}${val.homeImg.includes('?ci-process=snapshot&time=0&format=jpg') ? '' : `?imageView2/2/h/${val.height * pixelRatio}`}`,
        isVideo: val.resource[0].contentType.startsWith('video'),
      });
    },
  },
});
