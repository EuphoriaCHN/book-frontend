import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Pagination, Spin, Empty, message, Select, Tag } from "antd";
import Bar from "component/Bar/Bar";
import { GET_BOOK_LIST } from "api";
import { errHandling, debounce } from "@utils/util";
import { observer } from "mobx-react";
import ProjectStore from "store/project";
import BookModal from "component/BookModal/BookModal";

import "./Platform.scss";

type IProps = WithTranslation;

export type Keywords = {
  asso1: string;
  asso2: string;
  asso3: string;
  id: number;
  keyword: string;
};

type KeywordDictionary = {
  [k: number]: Keywords;
};

export type Books = {
  address: string;
  bookId: number;
  description: string;
  id: number;
  keyword1: string;
  keyword2: string;
  keyword3: string;
};

const Platform: React.SFC<IProps> = observer((props) => {
  const [pageSize, setPageSize] = React.useState<number>(12);
  const [currentIndex, setCurrentIndex] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Array<Books>>([]);
  const [keywordOptions, setKeywordOptions] = React.useState<Array<Keywords>>(
    []
  );
  const [keywordDict, setKeywordDict] = React.useState<KeywordDictionary>({});
  const [selectKeywordID, setSelectKeywordID] = React.useState<number>(0);
  const [searchValue, setSearchValue] = React.useState<string>("");

  const loadData = React.useCallback<
    (
      _pageSize?: number,
      _currentIndex?: number,
      _searchText?: string
    ) => Promise<unknown>
  >(
    async (_pageSize, _currentIndex, _searchText = "") => {
      setLoading(true);
      const limit = _pageSize || pageSize;
      const offset = ((_currentIndex || currentIndex) - 1) * pageSize;

      try {
        const data = await errHandling(GET_BOOK_LIST, {
          limit,
          offset,
          searchText: _searchText,
        });

        setTotal(data.count.length);
        setData(data.rows);
        setKeywordOptions(data.keyword);

        const dict = {};
        data.keyword.forEach((key: Keywords) => {
          dict[key.id] = key;
        });
        setKeywordDict(dict);
        if (Object.keys(dict).length) {
          const _default = parseInt(Object.keys(dict)[0]);
          setSelectKeywordID(_default);
        }
      } catch (error) {
        message.error(props.t("获取图书列表失败"));
        message.error(error.message);
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [pageSize, currentIndex]
  );

  // React component did mount
  React.useEffect(() => {
    loadData();
  }, []);

  const renderBarList = React.useMemo<Array<JSX.Element>>(
    () =>
      Array(Math.ceil(data.length / 4))
        .fill(1)
        .map((_, index: number) => (
          <Bar key={index} books={data.slice(index * 4, index * 4 + 4)} />
        )),
    [pageSize, currentIndex, data]
  );

  const renderDataCollection = React.useMemo<JSX.Element | Array<JSX.Element>>(
    () => (total ? renderBarList : <Empty />),
    [renderBarList, total]
  );

  const handleOnPaginationChange = React.useCallback<
    (newCurrent: number, newPageSize: number) => void
  >((newCurrent, newPageSize) => {
    setPageSize(newPageSize);
    setCurrentIndex(newCurrent);
    loadData(newPageSize, newCurrent);
  }, []);

  const handleDebounceSearch = React.useCallback<(text: string) => void>(
    debounce((text) => {
      setCurrentIndex(1);
      setSearchValue(text);
      loadData(null, 1, text);
    }, 500),
    []
  );

  const onSearch = React.useCallback<(value: string) => void>(
    (value) => {
      if (value.length) {
        handleDebounceSearch(value);
      }
    },
    [handleDebounceSearch]
  );

  const onSearchTextChange = React.useCallback<
    (value: number, record: any) => void
  >(
    (key, record) => {
      if (!record) {
        handleDebounceSearch("");
        setSelectKeywordID(0);
      } else {
        setSelectKeywordID(parseInt(record.key));
        handleDebounceSearch(record.children);
      }
    },
    [handleDebounceSearch]
  );

  const handleClickAssociationDictionary = React.useCallback<
    (text: string) => void
  >(
    (text) => {
      handleDebounceSearch(text);
    },
    [setSearchValue, loadData]
  );

  const renderSearchOptions = React.useMemo<Array<JSX.Element>>(
    () =>
      keywordOptions.map((option) => (
        <Select.Option key={option.id} value={option.keyword}>
          {option.keyword}
        </Select.Option>
      )),
    [keywordOptions]
  );

  const renderKeywordAssociation = React.useMemo<JSX.Element>(() => {
    if (!keywordDict[selectKeywordID]) {
      return null;
    }
    const { asso1, asso2, asso3 } = keywordDict[selectKeywordID];

    const elementArray: Array<JSX.Element> = [asso1, asso2, asso3].map(
      (asso) => {
        if (!asso) {
          return null;
        }
        return (
          <Tag
            color={"processing"}
            style={{ cursor: "pointer" }}
            onClick={handleClickAssociationDictionary.bind(this, asso)}
          >
            {asso}
          </Tag>
        );
      }
    );

    return (
      <div>
        <span>{props.t("联想词：")}</span>
        {elementArray}
      </div>
    );
  }, [keywordDict, selectKeywordID]);

  const render = React.useMemo<JSX.Element>(
    () => (
      <React.Fragment>
        <div className={"platform container"}>
          <header className={"platform-header"}>
            <h2>{props.t("书本列表")}</h2>
            <div className={"platform-header-operation"}>
              <Select
                placeholder={props.t("按照书名/关键字搜索")}
                onSearch={onSearch}
                onChange={onSearchTextChange as any}
                // onBlur={onSearchTextBlur}
                autoClearSearchValue={false}
                style={{ width: 300, height: 30 }}
                loading={loading}
                notFoundContent={null}
                filterOption={false}
                showArrow={false}
                defaultActiveFirstOption={false}
                allowClear
                showSearch
                value={searchValue === "" ? null : searchValue}
              >
                {renderSearchOptions}
              </Select>
              {renderKeywordAssociation}
            </div>
          </header>
          <Spin spinning={loading}>
            <div className={"platform-content"}>{renderDataCollection}</div>
            <footer className={"platform-footer"}>
              <Pagination
                total={total}
                pageSize={pageSize}
                current={currentIndex}
                pageSizeOptions={["12", "24", "36"]}
                onChange={handleOnPaginationChange}
                onShowSizeChange={handleOnPaginationChange}
                showTotal={(total) => props.t("共 {{total}} 本书籍", { total })}
                hideOnSinglePage
              />
            </footer>
          </Spin>
        </div>
        <BookModal
          visible={ProjectStore.bookModalVisible}
          book={ProjectStore.modalBooks}
        />
      </React.Fragment>
    ),
    [
      renderDataCollection,
      props.i18n.language,
      pageSize,
      currentIndex,
      total,
      loading,
      renderSearchOptions,
      renderKeywordAssociation,
      searchValue,
      ProjectStore.bookModalVisible,
    ]
  );

  return render;
});

export default withTranslation()(Platform);
