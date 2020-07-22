import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next';
import { RouteComponentProps } from 'react-router';
import { Books } from 'container/Platform/Platform';
import { message, Spin } from 'antd';
import { GET_BOOK_BY_ID } from 'api';
import { errHandling, getBookTitle } from '@utils/util';

import './BookDetail.scss'

type HistoryBookProps = {
  bookId: string;
};

interface IProps extends WithTranslation, RouteComponentProps<HistoryBookProps> { }

const BookDetail: React.SFC<IProps> = props => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [book, setBook] = React.useState<Books>(null);
  const [breadcrumbTitle, setBreadcrumbTitle] = React.useState<string>('');

  const loadData = React.useCallback<(id: string) => Promise<unknown>>(async id => {
    setLoading(true);
    try {
      const data: Array<Books> = await errHandling(GET_BOOK_BY_ID, { id });

      if (!data.length) {
        throw new Error('数据库中没有这本书');
      }

      const firstBook = data[0];
      setBreadcrumbTitle(getBookTitle(firstBook));
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

  const render = React.useMemo<JSX.Element>(() => (
    <Spin spinning={loading}>
      <div className={'container book-detail'}>
        <header>{breadcrumbTitle}</header>
        <div></div>
      </div>
    </Spin>
  ), [loading, breadcrumbTitle]);

  return render;
};

export default withTranslation()(BookDetail);