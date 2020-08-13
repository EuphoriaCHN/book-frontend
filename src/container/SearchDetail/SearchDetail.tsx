import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Input, Tooltip, Spin, message, Table, Tag } from 'antd';
import { QuestionCircleFilled } from '@ant-design/icons';
import { Books } from 'container/Platform/Platform';
import { GET_CHAPTER } from 'api';
import { errHandling, debounce } from '@utils/util';
import { PaginationProps } from 'antd/lib/pagination';
import { ColumnsType } from 'antd/lib/table';
import { GetComponentProps } from 'rc-table/lib/interface';

import './SearchDetail.scss';

type IProps = WithTranslation;

const SearchDetail: React.SFC<IProps> = (props) => {
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [currentIndex, setCurrentIndex] = React.useState<number>(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [total, setTotal] = React.useState<number>(0);
  const [data, setData] = React.useState<Array<Books>>([]);
  const [searchText, setSearchText] = React.useState<string>('');

  const loadData = React.useCallback<
    (
      _pageSize?: number,
      _currentIndex?: number,
      value?: string
    ) => Promise<unknown>
  >(async (_pageSize, _currentIndex, value) => {
    if (!value || !value.length) {
      setTotal(0);
      setData([]);
      return;
    }
    setLoading(true);
    const limit = _pageSize || pageSize;
    const offset = ((_currentIndex || currentIndex) - 1) * pageSize;

    try {
      const data: { count: number; rows: Array<Books> } = await errHandling(
        GET_CHAPTER,
        {
          searchText: value,
          limit,
          offset,
        }
      );

      const { count, rows } = data;
      setTotal(count);
      setData(rows);
    } catch (error) {
      message.error(props.t('获取章节信息失败！'));
    } finally {
      setLoading(false);
    }
  }, []);

  const searchChapter = React.useCallback<(value: string) => void>(
    debounce(async (value: string) => {
      setSearchText(value);
      loadData(null, 1, value);
    }, 500),
    []
  );

  const onSearchCategory = React.useCallback<(value: string) => void>(
    searchChapter,
    []
  );

  const handleOnPaginationChange = React.useCallback<
    (newCurrent: number, newPageSize: number) => void
  >(
    (newCurrent, newPageSize) => {
      setPageSize(newPageSize);
      setCurrentIndex(newCurrent);
      loadData(newPageSize, newCurrent, searchText);
    },
    [searchText]
  );

  const getPaginationProps = React.useMemo<PaginationProps>(
    () => ({
      current: currentIndex,
      pageSize: pageSize,
      total: total,
      showTotal: (total) => props.t('共 {{total}} 本书籍', { total }),
      hideOnSinglePage: true,
      onChange: handleOnPaginationChange,
      onShowSizeChange: handleOnPaginationChange,
    }),
    [currentIndex, pageSize, total, handleOnPaginationChange]
  );

  const renderTableAddress = React.useCallback<(value: string) => JSX.Element>(
    (value) => {
      value = value.split(/^煤矿通用知识教材\//)[1];

      const index = value.lastIndexOf(searchText);
      if (index === -1) {
        return <span>{value}</span>;
      }
      const length = searchText.length;

      const forward = value.slice(0, index);
      const backword = value.slice(index + length);

      return (
        <span>
          {forward}
          <span className={'search-detail-matching-text'}>{searchText}</span>
          {backword}
        </span>
      );
    },
    [searchText]
  );

  const onClickKeywords = React.useCallback<(target: string) => void>(
    (target) => {
      setSearchText(target);
      loadData(null, 1, target);
    },
    []
  );

  const renderTableKeywords = React.useCallback<
    (record: Books) => Array<JSX.Element>
  >(
    (record) => {
      const elements: Array<{ val: string; color?: string }> = [];

      Object.keys(record).forEach((key) => {
        if (key.indexOf('keyword') !== -1) {
          if (!record[key] || !record[key].length) {
            return;
          }
          if (record[key].indexOf(searchText) !== -1) {
            if (record[key].length !== searchText.length) {
              elements.push({ val: record[key], color: 'orange' });
            } else {
              elements.push({ val: record[key], color: 'green' });
            }
          } else {
            elements.push({ val: record[key] });
          }
        }
      });

      return elements.map((v) => (
        <Tag
          style={{ cursor: 'pointer' }}
          color={v.color}
          onClick={(event) => {
            event.stopPropagation();
            onClickKeywords(v.val);
          }}
        >
          {v.val}
        </Tag>
      ));
    },
    [searchText]
  );

  const tableColumn = React.useMemo<ColumnsType<Books>>(
    () => [
      {
        title: props.t('章节路径'),
        dataIndex: 'address',
        render: renderTableAddress,
      },
      {
        title: props.t('关键字'),
        render: renderTableKeywords,
      },
    ],
    [renderTableAddress, renderTableKeywords]
  );

  const getTableScrollHeight =
    (window.innerHeight ||
      (document.body || document.documentElement).clientHeight) - 400;

  const onRow = React.useCallback<GetComponentProps<Books>>(
    (record) => ({
      onClick: (event) => {
        const { id, bookId } = record;
        window.open(`/#/book/${bookId}00000?chapter=${id}`);
      },
    }),
    []
  );

  const render = React.useMemo<JSX.Element>(
    () => (
      <Spin spinning={loading}>
        <div className={'search-detail container'}>
          <header className={'search-detail-header'}>
            <h2>{props.t('章节搜索')}</h2>
            <div className={'search-detail-header-search'}>
              <Input.Search
                placeholder={props.t('搜索章节')}
                onSearch={onSearchCategory}
                onChange={(event) => setSearchText(event.target.value)}
                value={searchText}
                allowClear
                autoFocus
              />
              <Tooltip title={props.t('根据章节名称 / 关键词搜寻章节')}>
                <QuestionCircleFilled />
              </Tooltip>
            </div>
          </header>
          <div className={'search-detail-content'}>
            <Table
              columns={tableColumn}
              dataSource={data}
              pagination={getPaginationProps}
              scroll={{ y: getTableScrollHeight }}
              onRow={onRow}
              rowClassName={'search-detail-content-table-row'}
            />
          </div>
        </div>
      </Spin>
    ),
    [
      loading,
      data,
      getPaginationProps,
      tableColumn,
      getTableScrollHeight,
      searchText,
    ]
  );

  return render;
};

export default withTranslation()(SearchDetail);
