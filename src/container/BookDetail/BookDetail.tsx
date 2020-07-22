import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { Books } from 'container/Platform/Platform';
import { message, Spin, Breadcrumb, Tree } from 'antd';
import { GET_BOOK_BY_ID, MAKE_PDF_URL } from 'api';
import { errHandling, getBookTitle } from '@utils/util';
import { HomeOutlined, DownOutlined } from '@ant-design/icons';
import { Key, EventDataNode, DataNode } from 'rc-tree/lib/interface';

import './BookDetail.scss'

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

interface IProps extends WithTranslation, RouteComponentProps<HistoryBookProps> { }

const BookDetail: React.SFC<IProps> = props => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [breadcrumbTitle, setBreadcrumbTitle] = React.useState<string>(props.t('加载中...'));
  const [treeData, setTreeData] = React.useState<BookDetailTreenode>(null);
  const [pdfUrl, setPdfUrl] = React.useState<string>('');

  const constructTreeData = React.useCallback<(books: Array<Books>) => BookDetailTreenode>(books => {
    const data: BookDetailTreenode = { title: undefined, key: undefined, children: undefined };

    books.forEach(book => {
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
          prevNode.children[levels[i]] = { title: undefined, key: undefined, children: undefined };
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

  const loadData = React.useCallback<(id: string) => Promise<unknown>>(async id => {
    setLoading(true);
    try {
      const data: Array<Books> = await errHandling(GET_BOOK_BY_ID, { id });

      if (!data.length) {
        throw new Error('数据库中没有这本书');
      }

      const firstBook = data[0];
      setBreadcrumbTitle(getBookTitle(firstBook));

      setTreeData(constructTreeData(data));
    } catch (error) {
      message.error(props.t('获取书籍详情失败'));
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Component did mount
  React.useEffect(() => {
    const { bookId } = props.match.params;
    if (!bookId) {
      message.error(props.t('错误的 URL 参数，无法解析书籍信息'));
      return;
    }
    loadData(bookId);
  }, []);

  const getTreeNode = React.useCallback<(node: BookDetailTreenode) => JSX.Element>(node => {
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

  const onSelect = React.useCallback<(selectedKeys: Key[], info: {
    event: 'select';
    selected: boolean;
    node: EventDataNode;
    selectedNodes: DataNode[];
    nativeEvent: MouseEvent;
  }) => void>((selectedKeys, info) => {
    if (selectedKeys && selectedKeys.length && (selectedKeys[0] as string).endsWith('.pdf')) {
      // 获得具体 PDF address
      const { key: address } = info.node;
      console.log(MAKE_PDF_URL({ path: (address as string) }))
      setPdfUrl(MAKE_PDF_URL({ path: (address as string) }));
    }
  }, []);

  const renderTreeDOM = React.useMemo<JSX.Element>(() => {
    return (
      <Tree
        showLine
        switcherIcon={<DownOutlined />}
        onSelect={onSelect}
      >
        {getTreeNode(treeData)}
      </Tree>
    );
  }, [treeData]);

  const render = React.useMemo<JSX.Element>(() => (
    <Spin spinning={loading} size={'large'}>
      <div className={'book-detail container'}>
        <header className={'book-detail-header'}>
          <Breadcrumb>
            <Breadcrumb.Item href="/#/platform">
              <HomeOutlined />
              <span>{props.t('书本列表')}</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{breadcrumbTitle}</Breadcrumb.Item>
          </Breadcrumb>
        </header>
        <div className={'book-detail-content'}>
          <div className={'book-detail-content-sider'}>
            {renderTreeDOM}
          </div>
          <div className={'book-detail-content-main'}>
            <iframe src={pdfUrl} />
          </div>
        </div>
      </div>
    </Spin>
  ), [loading, breadcrumbTitle, renderTreeDOM, pdfUrl]);

  return render;
};

export default withTranslation()(BookDetail);