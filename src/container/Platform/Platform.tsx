import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next';
import { Pagination, Spin, Empty, message, Input } from 'antd';
import Bar from 'component/Bar/Bar';
import { GET_BOOK_LIST } from 'api';
import { errHandling, debounce } from '@utils/util';
import { AudioOutlined } from '@ant-design/icons';

import './Platform.scss'

type IProps = WithTranslation;

export type Books = {
  address: string;
  bookId: number;
  description: string;
  id: number;
  keyword1: string;
  keyword2: string;
  keyword3: string;
};

const Platform: React.SFC<IProps> = props => {
  const [pageSize, setPageSize] = React.useState<number>(12);
  const [currentIndex, setCurrentIndex] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Array<Books>>([]);

  const loadData = React.useCallback<
    (_pageSize?: number, _currentIndex?: number) => Promise<unknown>
  >(async (_pageSize, _currentIndex) => {
    setLoading(true);
    const limit = _pageSize || pageSize;
    const offset = ((_currentIndex || currentIndex) - 1) * pageSize;

    try {
      const data = await errHandling(GET_BOOK_LIST, { limit, offset });

      setTotal(data.count.length);
      setData(data.rows);
    } catch (error) {
      message.error(props.t('获取图书列表失败'));
      message.error(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, currentIndex]);

  // React component did mount
  React.useEffect(() => {
    loadData();
  }, []);

  const renderBarList = React.useMemo<Array<JSX.Element>>(() => (
    Array(Math.floor(pageSize / 4)).fill(1).map((_, index: number) => (
      <Bar key={index} books={data.slice(index * 4, index * 4 + 4)} />
    ))
  ), [pageSize, currentIndex, data]);

  const renderDataCollection = React.useMemo<JSX.Element | Array<JSX.Element>>(() => (
    total ? renderBarList : <Empty />
  ), [renderBarList, total]);

  const handleOnPaginationChange = React.useCallback<
    (newCurrent: number, newPageSize: number) => void
  >((newCurrent, newPageSize) => {
    setPageSize(newPageSize);
    setCurrentIndex(newCurrent);
    loadData(newPageSize, newCurrent);
  }, []);

  const render = React.useMemo<JSX.Element>(() => (
    <div className={'platform container'}>
      <header className={'platform-header'}>
        <h2>{props.t('书本列表')}</h2>
        <Input.Search
          placeholder={props.t('按照书名/关键字搜索')}
          onSearch={value => console.log(value)}
          style={{ width: 300, height: 30 }}
        />
      </header>
      <Spin spinning={loading}>
        <div className={'platform-content'}>
          {renderDataCollection}
        </div>
        <footer className={'platform-footer'}>
          <Pagination
            total={total}
            pageSize={pageSize}
            current={currentIndex}
            pageSizeOptions={['12', '24', '36']}
            onChange={handleOnPaginationChange}
            showTotal={total => props.t('共 {{total}} 本书籍', { total })}
          />
        </footer>
      </Spin>
    </div>
  ), [renderDataCollection, props.i18n.language, pageSize, currentIndex, total, loading]);

  return render;
};

export default withTranslation()(Platform);
