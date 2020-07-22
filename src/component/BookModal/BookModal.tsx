import * as React from 'react'
import { withTranslation, WithTranslation } from 'react-i18next';
import { Modal, Tooltip } from 'antd';
import { Books } from 'container/Platform/Platform';
import ProjectStore from 'store/project';
import { MAKE_BOOK_IMAGE_URL } from 'api';
import DztImageGalleryComponent from 'reactjs-image-gallery';
import { useHistory } from 'react-router'

import './BookModal.scss'

interface IProps extends WithTranslation {
  visible: boolean;
  book: Books;
};

type ImageGalleryConfig = {
  url: string;
  title: string;
  thumbUrl: string;
};

const BookModal: React.SFC<IProps> = props => {
  const _history = useHistory();

  const [imageUrl, setImageUrl] = React.useState<string>('');
  const [thumbImageTooltipVisible, setThumbImageTooltipVisible] = React.useState<boolean>(false);

  const loadData = React.useCallback<(book: Books) => void>(book => {
    const { address } = book;
    const imageAddress = address.split(/煤矿通用知识教材\/(\d+.*)\/.*/)[1].split('\/')[0];

    // 获取图片 URL
    const imageUrl = MAKE_BOOK_IMAGE_URL({ imageName: imageAddress, mock: true });
    setImageUrl(imageUrl);
  }, []);

  // Modal on visible
  React.useEffect(() => {
    if (!props.visible) {
      return;
    }
    loadData(props.book);
  }, [props.visible]);

  const handleCloseModal = React.useCallback<() => void>(() => {
    ProjectStore.setBookModalVisible(false);
  }, []);

  const handleRouteToBookDetail = React.useCallback<(book: Books) => void>(book => {
    if (!book || !book.id) {
      return;
    }
    _history.push(`/book/${book.id}`);
  }, []);

  const getBookTitle = React.useMemo<string>(() => {
    if (!props.book || !props.book.address) {
      return '';
    }
    return props.book.address.split(/煤矿通用知识教材\/(\d+.*)\/.*/)[1].split('\/')[0];
  }, [props.book]);

  const getImageGallaryConfig = React.useMemo<Array<ImageGalleryConfig>>(() => ([{
    url: imageUrl,
    thumbUrl: imageUrl,
    title: getBookTitle
  }]), [imageUrl, getBookTitle]);

  const render = React.useMemo<JSX.Element>(() => (
    <React.Fragment>
      <Modal
        visible={props.visible}
        onCancel={handleCloseModal}
        footer={null}
        title={getBookTitle}
        destroyOnClose
      >
        <div className={'book-modal-content'}>
          <Tooltip title={props.t('点击查看大图')} visible={thumbImageTooltipVisible}>
            <div
              className={'book-modal-content-image'}
              onMouseEnter={setThumbImageTooltipVisible.bind(this, true)}
              onClick={setThumbImageTooltipVisible.bind(this, false)}
              onMouseOut={setThumbImageTooltipVisible.bind(this, false)}
            >
              <DztImageGalleryComponent images={getImageGallaryConfig} />
            </div>
          </Tooltip>
          <Tooltip title={props.t('阅读书籍')}>
            <div className={'book-modal-content-book'} onClick={handleRouteToBookDetail.bind(this, props.book)}>
              <div className={'book-modal-content-book-menu'}>{getBookTitle}</div>
              <div className={'book-modal-content-book-rope'} />
            </div>
          </Tooltip>
        </div>
      </Modal>
    </React.Fragment>
  ), [props.visible, getImageGallaryConfig, getBookTitle, thumbImageTooltipVisible]);

  return render;
};

export default withTranslation()(BookModal);