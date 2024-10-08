import React, {
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDidShow } from '@tarojs/taro';
import { ConfigProvider, Loading, Empty } from '@nutui/nutui-react-taro';
import { View, Text, Image, ScrollView, ScrollViewProps } from '@tarojs/components';

import { judgePlatform } from '@/utils';

import styles from './index.module.less';

export interface IRefProps<T> {
  /**
   * 重新获取整个列表数据
   */
  refetchAllData: () => Promise<boolean>;
  /**
   * 重新加载
   * @description 从第一页开始加载
   */
  reload: () => Promise<boolean>;
  /**
   * 获取列表数据
   */
  getDataSource: () => T[];
}

type PageData<T> = {
  page: {
    size: number;
    total: number;
  };
  content: T[];
};

interface IProps<T>
  extends Partial<Omit<ScrollViewProps, 'scrollX' | 'scrollLeft' | 'onScrollToLower'>> {
  height: number;
  isScroll?: boolean;
  loadingText?: React.ReactNode;
  loadMoreText?: React.ReactNode;
  defaultSize?: number;
  emptyIcon?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  /**
   * 当页面重新获得焦点是否重新拉取一遍数据
   * @default true
   */
  autoRefetch?: boolean;
  /**
   * 列数
   * @default 1
   */
  col?: number;
  /**
   * 当请求结束执行的回调
   */
  onRequestEnd?: (params: { data: T[] }) => void;
  /**
   * 获取数据
   */
  request: (page: { index: number; size: number }) => Promise<PageData<T>>;
  /**
   * 渲染列表项
   */
  renderItem: (item: PageData<T>['content'][0], index: number) => React.ReactNode;
}

const ScrollList: React.ForwardRefRenderFunction<IRefProps<any>, IProps<any>> = (props, ref) => {
  const {
    height,
    defaultSize = 10,
    lowerThreshold = 150,
    col = 1,
    isScroll = true,
    autoRefetch = true,
    loadingText,
    loadMoreText,
    emptyIcon,
    emptyDescription,
    style,
    className,
    request,
    renderItem,
    onRequestEnd,
    ...remainProps
  } = props;
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [list, setList] = useState<PageData<any>['content']>([]);
  const [page, setPage] = useState({
    index: 1,
    size: defaultSize,
  });
  const [pageTotal, setPageTotal] = useState(0);
  const isMountedRef = useRef(false);

  useImperativeHandle(ref, () => ({
    refetchAllData,
    reload,
    getDataSource,
  }));

  useEffect(() => {
    // 第一次挂载
    isMountedRef.current = true;
    refetchData();
  }, []);

  useDidShow(() => {
    if (isMountedRef.current && autoRefetch) {
      refetchAllData();
    }
  });

  function refetchAllData() {
    const pageSize = page.size * page.index;
    refetchData({
      fetchSize: pageSize,
      fetchIndex: 1,
      reset: true,
    });
    return Promise.resolve(true);
  }

  async function reload() {
    setPage({
      index: 1,
      size: defaultSize,
    });
    await refetchData({
      reset: true,
    });
    return true;
  }

  function getDataSource() {
    return list;
  }

  async function refetchData(params?: {
    reset?: boolean;
    fetchSize?: number;
    fetchIndex?: number;
  }) {
    setLoading(true);
    const { reset, fetchSize, fetchIndex } = params || {};
    const { index, size } = page;
    try {
      const res = await request({
        index: fetchIndex || (reset ? 1 : index),
        size: fetchSize || size,
      });
      const {
        content,
        page: { total },
      } = res;
      let allData: any[] = [];
      if (reset) {
        allData = [...content];
      } else {
        allData = [...list, ...content];
      }
      setPageTotal(total);
      setHasMore(allData.length < total);
      setList(allData);
      onRequestEnd?.({ data: allData });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  async function handleScrollToLower() {
    if (!hasMore || loading) {
      return;
    }
    const pageIndex = page.index;
    setPage((pre) => ({
      ...pre,
      index: pre.index + 1,
    }));
    await refetchData({
      fetchIndex: pageIndex + 1,
    });
  }

  const loadingRender = useMemo(() => {
    return loading && list.length && hasMore ? (
      isValidElement(loadingText) ? (
        loadingText
      ) : (
        <View className={styles.loading}>
          <Loading>{loadingText || '(ง •̀_•́)ง努力加载中...'} </Loading>
        </View>
      )
    ) : null;
  }, [loading, list.length, loadingText, hasMore]);

  const loadingMoreRender = useMemo(() => {
    return !hasMore && pageTotal !== 0 ? (
      isValidElement(loadMoreText) ? (
        loadMoreText
      ) : (
        <View className={styles.loading}>
          <Text>{loadMoreText || '(￣▽￣)ノ已经到底啦'}</Text>
        </View>
      )
    ) : null;
  }, [loadMoreText, hasMore, pageTotal]);

  return (
    <ScrollView
      scrollY={isScroll}
      scrollWithAnimation
      enhanced={judgePlatform('weapp')}
      showScrollbar={false}
      lowerThreshold={lowerThreshold}
      onScrollToLower={handleScrollToLower}
      style={{
        ...((style as React.CSSProperties) || {}),
        height: height,
        textAlign: col === 1 ? 'left' : 'justify',
      }}
      className={`${styles.scrollListWrap} ${!isScroll ? styles.noScroll : ''} ${className || ''}`}
      {...remainProps}
    >
      {!list.length ? (
        loading ? (
          <ConfigProvider
            theme={{
              nutuiLoadingIconSize: '24px',
            }}
            style={{ height: '100%' }}
          >
            <View className={styles.loadingContainer}>
              <Loading direction="vertical">
                <Text className={styles.loadingContainerText}>努力加载中...</Text>
              </Loading>
            </View>
          </ConfigProvider>
        ) : (
          <Empty
            description={
              isValidElement(emptyDescription) ? (
                emptyDescription
              ) : (
                <Text className={styles.emptyText}>{emptyDescription || '暂无数据'}</Text>
              )
            }
            size="small"
            style={{ width: '100%' }}
            image={
              emptyIcon ? (
                emptyIcon
              ) : (
                <Image className={styles.emptyImage} src="images/scrollList/empty.png" />
              )
            }
            className={styles.empty}
          />
        )
      ) : (
        list.map((item, index) => (
          <View
            key={index}
            style={{ width: `${100 / col - (col === 1 ? 0 : 2)}%` }}
            className={col === 1 ? '' : styles.itemWrap}
          >
            {renderItem(item, index)}
          </View>
        ))
      )}
      {loadingRender}
      {loadingMoreRender}
    </ScrollView>
  );
};

export default forwardRef(ScrollList) as <T = unknown>(
  props: IProps<T>,
  ref: React.Ref<IRefProps<T>>,
) => React.ReactElement;
