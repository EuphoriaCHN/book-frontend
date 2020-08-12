import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { Books } from 'container/Platform/Platform';
import {
  message,
  Spin,
  Breadcrumb,
  Tree,
  Input,
  Typography,
  Tooltip,
} from 'antd';
import { GET_BOOK_BY_ID, MAKE_PDF_URL, GET_ONE_BOOK } from 'api';
import { errHandling, getBookTitle } from '@utils/util';
import { HomeOutlined, DownOutlined } from '@ant-design/icons';
import { Key, EventDataNode, DataNode } from 'rc-tree/lib/interface';

import './BookDetail.scss';
import Modal from 'antd/lib/modal/Modal';

export type BookDetailTreenode = {
  title: string;
  key: string;
  children: {
    [k: string]: BookDetailTreenode;
  };
};

type HistoryBookProps = {
  bookId: string;
};

interface IProps
  extends WithTranslation,
    RouteComponentProps<HistoryBookProps> {}

const BookDetail: React.SFC<IProps> = (props) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [breadcrumbTitle, setBreadcrumbTitle] = React.useState<string>(
    props.t('加载中...')
  );
  const [treeData, setTreeData] = React.useState<BookDetailTreenode>(null);
  const [pdfUrl, setPdfUrl] = React.useState<string>('');
  const [expandedKeys, setExpandedKeys] = React.useState<Array<string>>([]);
  const [selectedKeys, setSelectedKeys] = React.useState<Array<string>>([]);
  const [searchText, setSearchText] = React.useState<string>('');
  const [otherBook, setOtherBook] = React.useState<Books>(null);
  const [goOtherBookModalVisible, setGoOtherBookModalVisible] = React.useState<
    boolean
  >(false);

  const onSearchCategory = React.useCallback<(searchText: string) => void>(
    (searchText) => {
      if (!searchText || !searchText.length) {
        return;
      }
      setLoading(true);
      errHandling(GET_ONE_BOOK, {
        address: searchText,
        bookId: props.match.params.bookId,
      })
        .then(
          (value: { target: Books; other: Books }) => {
            setSearchText(searchText);

            if (!value.target) {
              message.info(
                props.t('《{{_book}}》 书籍中没有 "{{_addr}}" 章节', {
                  _book: breadcrumbTitle,
                  _addr: searchText,
                })
              );
              if (value.other) {
                // 在其他书中搜到了这个
                setOtherBook(value.other);
                setGoOtherBookModalVisible(true);
              }
              return;
            }
            const { address } = value.target;
            const keys: Array<string> = address.split(/\//);
            const _expandedKeys: Array<string> = [];
            for (let i = 0; i < keys.length; i++) {
              if (i === 0) {
                _expandedKeys.push(keys[i]);
                continue;
              }
              const before = _expandedKeys[i - 1];
              _expandedKeys.push(before.concat('/').concat(keys[i]));
            }
            const bookKey = _expandedKeys.pop();
            console.log(bookKey);
            const bookName: string = bookKey
              .split(/\//)
              .pop()
              .split(/\.pdf$/)[0];
            message.success(props.t('检索到 {{_book}}', { _book: bookName }));
            setSelectedKeys([bookKey]);
            setExpandedKeys(_expandedKeys);
          },
          (reason: any) => {
            message.error(props.t('搜索图书失败！'));
            console.error(reason);
          }
        )
        .finally(() => {
          setLoading(false);
        });
    },
    [breadcrumbTitle]
  );

  const renderOtherBookText = React.useCallback<() => JSX.Element>(() => {
    if (!otherBook) {
      return null;
    }
    const linkHref = `/#/book/${otherBook.bookId}00000`;
    const otherBookName: string = otherBook.address.split(/\//)[1];

    return (
      <React.Fragment>
        <Typography.Text>
          {props.t(
            '虽然没有在 《{{_nowBook}}》 中找到 "{{_address}}" 关键字，但在',
            {
              _nowBook: breadcrumbTitle,
              _address: searchText,
            }
          )}
        </Typography.Text>
        <Tooltip title={props.t('点击可打开新窗口')}>
          <Typography.Link onClick={window.open.bind(this, linkHref)}>
            《{otherBookName}》
          </Typography.Link>
        </Tooltip>
        <Typography.Text>{props.t('中找到了！')}</Typography.Text>
      </React.Fragment>
    );
  }, [otherBook, searchText]);

  const onTreeNodeExpand = React.useCallback<
    (
      expandedKeys: React.ReactText[],
      info: {
        node: EventDataNode;
        expanded: boolean;
        nativeEvent: MouseEvent;
      }
    ) => void
  >((expandedKeys, info) => {
    setExpandedKeys(expandedKeys as Array<string>);
  }, []);

  const constructTreeData = React.useCallback<
    (books: Array<Books>) => BookDetailTreenode
  >((books) => {
    const data: BookDetailTreenode = {
      title: undefined,
      key: undefined,
      children: undefined,
    };

    books.forEach((book) => {
      const levels = book.address.split(/\//);
      let prevNode: BookDetailTreenode = null;
      let prevKey = '';

      for (let i = 0; i < levels.length; i++) {
        // 连 root 都没有
        if (!data.title) {
          data.title = levels[i];
          data.key = levels[i];
          data.children = {};
          prevKey = levels[i];
          prevNode = data;
          continue;
        }
        // 第一层
        if (!prevNode) {
          prevNode = data;
          prevKey = data.key;
          continue;
        }
        // 不是第一层了
        if (!prevNode.children[levels[i]]) {
          prevNode.children[levels[i]] = {
            title: undefined,
            key: undefined,
            children: undefined,
          };
          // 这个子元素没出现过
          prevNode.children[levels[i]].title = levels[i];
          prevNode.children[levels[i]].key = `${prevKey}/${levels[i]}`;
          prevNode.children[levels[i]].children = {};
          prevKey = prevNode.children[levels[i]].key;
          prevNode = prevNode.children[levels[i]];
          continue;
        }
        // 这个子元素出现过了
        prevKey = prevNode.children[levels[i]].key;
        prevNode = prevNode.children[levels[i]];
      }
    });

    return data;
  }, []);

  const loadData = React.useCallback<(id: string) => Promise<unknown>>(
    async (id) => {
      setLoading(true);
      try {
        const data: Array<Books> = await errHandling(GET_BOOK_BY_ID, { id });

        if (!data.length) {
          throw new Error(props.t('数据库中没有这本书'));
        }

        const firstBook = data[0];
        setBreadcrumbTitle(getBookTitle(firstBook));

        const treeData = constructTreeData(data);
        setTreeData(treeData);
      } catch (error) {
        message.error(props.t('获取书籍详情失败'));
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Component did mount
  React.useEffect(() => {
    const { bookId } = props.match.params;
    if (!bookId) {
      message.error(props.t('错误的 URL 参数，无法解析书籍信息'));
      return;
    }
    loadData(bookId);
  }, []);

  const getTreeNode = React.useCallback<
    (node: BookDetailTreenode) => JSX.Element
  >((node) => {
    if (!node) {
      return null;
    }
    if (node.children) {
      return (
        <Tree.TreeNode title={node.title} key={node.key}>
          {Object.values(node.children).map(getTreeNode)}
        </Tree.TreeNode>
      );
    }

    return <Tree.TreeNode title={node.title} key={node.key} />;
  }, []);

  const onSelect = React.useCallback<
    (
      selectedKeys: Key[],
      info: {
        event: 'select';
        selected: boolean;
        node: EventDataNode;
        selectedNodes: DataNode[];
        nativeEvent: MouseEvent;
      }
    ) => void
  >((selectedKeys, info) => {
    if (
      selectedKeys &&
      selectedKeys.length &&
      (selectedKeys[0] as string).endsWith('.pdf')
    ) {
      setSelectedKeys(selectedKeys as Array<string>);

      // 获得具体 PDF address
      const { key: address } = info.node;
      setPdfUrl(MAKE_PDF_URL({ path: address as string }));
    }
  }, []);

  const renderTreeDOM = React.useMemo<JSX.Element>(() => {
    return (
      <Tree
        switcherIcon={<DownOutlined />}
        onSelect={onSelect}
        onExpand={onTreeNodeExpand}
        expandedKeys={expandedKeys}
        selectedKeys={selectedKeys}
        showLine
      >
        {getTreeNode(treeData)}
      </Tree>
    );
  }, [treeData, expandedKeys, selectedKeys]);

  const render = React.useMemo<JSX.Element>(
    () => (
      <React.Fragment>
        <Spin spinning={loading} size={'large'}>
          <div className={'book-detail container'}>
            <header className={'book-detail-header'}>
              <div>
                <Breadcrumb>
                  <Breadcrumb.Item href="/#/platform">
                    <HomeOutlined />
                    <span>{props.t('书本列表')}</span>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>{breadcrumbTitle}</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div className={'book-detail-header-search'}>
                <Input.Search
                  placeholder={props.t('搜索章节')}
                  onSearch={onSearchCategory}
                  allowClear
                />
              </div>
            </header>
            <div className={'book-detail-content'}>
              <div className={'book-detail-content-sider'}>{renderTreeDOM}</div>
              <div className={'book-detail-content-main'}>
                <iframe src={pdfUrl} />
              </div>
            </div>
          </div>
        </Spin>
        <Modal
          visible={goOtherBookModalVisible}
          onCancel={setGoOtherBookModalVisible.bind(this, false)}
          okButtonProps={{ hidden: true }}
          cancelText={props.t('取消')}
          closeIcon={false}
        >
          {renderOtherBookText()}
        </Modal>
      </React.Fragment>
    ),
    [
      loading,
      breadcrumbTitle,
      renderTreeDOM,
      pdfUrl,
      onSearchCategory,
      goOtherBookModalVisible,
      renderOtherBookText,
    ]
  );

  return render;
};

export default withTranslation()(BookDetail);
