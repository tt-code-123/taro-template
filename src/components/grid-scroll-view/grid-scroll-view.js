/* eslint-disable no-undef */
// eslint-disable-next-line no-undef
Component({
  /**
   * 用来接收父组件传来的属性
   */
  properties: {
    /**
     * 交叉轴元素数量
     */
    crossAxisCount: {
      type: Number,
      value: 2,
    },
    /**
     * 交叉轴方向间隔
     */
    crossAxisGap: {
      type: Number,
      value: 6,
    },
    /**
     * 主轴方向间隔
     */
    mainAxisGap: {
      type: Number,
      value: 4,
    },
    height: {
      type: Number,
      value: 0,
    },
    /**
     * 距底部多远时，触发 scrolltolower 事件
     */
    lowerThreshold: {
      type: Number,
      value: 200,
    },
    /**
     * 默认分页条数
     */
    defaultPageSize: {
      type: Number,
      value: 10,
    },
    /**
     * 获取数据
     */
    request: {
      type: Function,
      value: null,
    },
  },
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    loadedDataList: [],
    showDataList: [],
    errorLoadCount: 0,
    loadCount: 0,
    hasMore: true,
    loading: false,
    page: {
      pageSize: 10,
      pageCurrent: 1,
      totalRecords: 0,
    },
    windowInfo: wx.getWindowInfo(),
  },
  /**
   * 组件自定义方法
   */
  methods: {
    onImageLoad(item, index, reset) {
      const that = this;
      wx.getImageInfo({
        src: `${item.homeImg}${item.homeImg.includes('?ci-process=snapshot&time=0&format=jpg') ? '' : '?imageView2/1/q/1'}`,
        success: (e) => {
          const { dataList, errorLoadCount, loadCount, loadedDataList, showDataList, windowInfo } =
            that.data;
          const oImgW = e.width;
          const oImgH = e.height;
          const imgWidth = (windowInfo.windowWidth - 16 - that.properties.crossAxisGap) / 2;
          const scale = imgWidth / oImgW;
          const imgHeight = Math.round(oImgH * scale);
          const currentCount = loadCount + 1;
          const tempShowDataList = [...showDataList];
          const currentDataList = dataList.map((dataItem) => {
            if (dataItem.id === item.id) {
              const obj = {
                ...dataItem,
                height: imgHeight,
              };
              tempShowDataList.push({ ...obj, index });
              return obj;
            }
            return dataItem;
          });

          that.setData({
            dataList: currentDataList,
            loadCount: currentCount,
            showDataList: tempShowDataList,
          });

          if (currentCount === dataList.length - errorLoadCount) {
            that.setData({
              loading: false,
              loadedDataList: reset
                ? currentDataList
                : loadedDataList.concat(tempShowDataList.sort((a, b) => a.index - b.index)),
              showDataList: [],
            });
          }
        },
        fail: () => {
          that.handleImgError(reset);
        },
      });
    },
    handleImgError(reset) {
      const { errorLoadCount, dataList, loadedDataList, showDataList } = this.data;
      this.setData({
        errorLoadCount: errorLoadCount + 1,
      });

      if (loadedDataList.length + showDataList.length === dataList.length - (errorLoadCount + 1)) {
        this.setData({
          loadedDataList: reset
            ? dataList.filter((item) => item.height)
            : loadedDataList.concat(showDataList.sort((a, b) => a.index - b.index)),
          showDataList: [],
          loading: false,
        });
      }
    },
    refetchAllData() {
      const that = this;
      const {
        page: { pageSize, pageCurrent },
      } = that.data;
      const size = pageSize * pageCurrent;

      that.setData(
        {
          loadCount: 0,
        },
        () => {
          that.refetchData({
            fetchSize: size,
            fetchIndex: 1,
            reset: true,
          });
        },
      );
    },
    async refetchData(params) {
      this.setData({ loading: true });
      const { reset, fetchSize, fetchIndex } = params || {};
      const { dataList, page } = this.data;
      const { pageCurrent, pageSize } = page;
      const that = this;

      this.triggerEvent('request', {
        pageCurrent: fetchIndex || (reset ? 1 : pageCurrent),
        pageSize: fetchSize || pageSize,
        onSuccess(res) {
          const { records, totalRecords } = res;
          const { errorLoadCount } = that.data;
          let allData = [];
          if (reset) {
            allData = [...records];
          } else {
            allData = [...dataList, ...records];
          }
          allData = allData.map((item) => {
            if (!item.homeImg && item.resource.length > 0) {
              if (item.resource[0].contentType.includes('video')) {
                return {
                  ...item,
                  homeImg: `${item.resource[0].fileUrl}?ci-process=snapshot&time=0&format=jpg`,
                };
              }
              return {
                ...item,
                homeImg: item.resource[0].fileUrl,
              };
            }
            return item;
          });
          that.setData(
            {
              dataList: allData,
              'page.totalRecords': totalRecords,
              hasMore: allData.length < totalRecords,
              errorLoadCount: reset ? 0 : errorLoadCount,
            },
            () => {
              if (!reset) {
                records
                  .map((item) => {
                    if (!item.homeImg && item.resource.length > 0) {
                      if (item.resource[0].contentType.includes('video')) {
                        return {
                          ...item,
                          homeImg: `${item.resource[0].fileUrl}?ci-process=snapshot&time=0&format=jpg`,
                        };
                      }
                      return {
                        ...item,
                        homeImg: item.resource[0].fileUrl,
                      };
                    }
                    return item;
                  })
                  .forEach((item, index) => {
                    that.onImageLoad(item, index);
                  });
              } else {
                allData.forEach((item) => {
                  that.onImageLoad(item, index, true);
                });
              }
            },
          );
        },
        onError() {
          that.setData({
            loading: false,
          });
        },
      });
    },
    async onScrollToLower() {
      const { hasMore, page, loading } = this.data;

      if (!hasMore || loading) {
        return;
      }
      const pageIndex = page.pageCurrent;
      this.setData({
        'page.pageCurrent': pageIndex + 1,
      });
      await this.refetchData({
        fetchIndex: pageIndex + 1,
      });
    },
  },
  /**
   * 组件生命周期
   */
  lifetimes: {
    attached: function () {
      this.setData(
        {
          'page.pageSize': this.properties.defaultPageSize,
        },
        () => {
          this.refetchData();
        },
      );
    },
    detached: function () {
      // 组件实例被从页面节点树移除时执行
      console.log('组件实例已移除');
      // 可以在这里执行清理操作
    },
  },
  /**
   * 组件所在页面的生命周期
   */
  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log('页面被展示');
    },
  },
});
