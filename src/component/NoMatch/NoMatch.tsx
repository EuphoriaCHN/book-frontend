import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { History } from 'history';

import { Empty, Button } from 'antd';

import './NoMatch.scss';

interface IProps extends WithTranslation {
  history: History;
}

const EmptyDescription: React.FC<IProps> = (props): React.ReactElement => (
  <span className={'no-match-description'}>{props.t('不要乱翻啦，没这个页面的')}</span>
);

const NoMatch: React.FC<IProps> = (props): React.ReactElement => {
  const handleReturnPlatform = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    props.history.push('/question');
  };
  const handleReturnBeforePage = (e: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    props.history.goBack();
  };
  const imageStyle = { height: 200 };

  return (
    <Empty
      className={'no-match'}
      image={Empty.PRESENTED_IMAGE_DEFAULT}
      imageStyle={imageStyle}
      description={<EmptyDescription {...props} />}
    >
      <div className={'no-match-button-list'}>
        <Button type="primary" onClick={handleReturnBeforePage} ghost>
          {props.t('返回上一页')}
        </Button>
        <Button type="primary" onClick={handleReturnPlatform} ghost>
          {props.t('返回主页')}
        </Button>
      </div>
    </Empty>
  );
};

export default withTranslation()(NoMatch);
