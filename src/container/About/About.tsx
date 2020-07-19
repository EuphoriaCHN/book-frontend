import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import dateFormat from 'dateformat';

import { Descriptions, Row, Col, Badge } from 'antd';

import './About.scss';

type IProps = WithTranslation;

const FrontendTechnologyStack = [
  { href: 'https://zh-hans.reactjs.org/', name: 'React' },
  { href: 'https://ant.design/index-cn', name: 'Ant Design' },
  { href: 'https://mobx.js.org/README.html', name: 'MobX' },
  { href: 'https://webpack.js.org/', name: 'Webpack' },
  { href: 'https://babeljs.io/', name: 'Babel' },
  { href: 'https://www.typescriptlang.org/', name: 'TypeScript' },
  { href: 'https://github.com/postcss/autoprefixer', name: 'Autoprefixer' },
  { href: 'https://eslint.org/', name: 'ESLint' },
  { href: 'https://github.com/amireh/happypack', name: 'Happypack' },
  { href: 'https://sass-lang.com/', name: 'Sass' },
  { href: 'https://github.com/axios/axios', name: 'Axios' },
  { href: 'https://www.i18next.com/', name: 'I18next' },
];

const BackendTechnologyStack = [
  { href: 'https://nodejs.org/zh-cn/', name: 'NodeJS' },
  { href: 'https://koajs.com/', name: 'Koa' },
  { href: 'https://www.mysql.com/cn/', name: 'MySQL' },
  { href: 'https://github.com/koajs/session', name: 'Koa-session' },
  { href: 'https://sequelize.org/v5/index.html', name: 'Sequelize' },
];

interface TSDIProps {
  value: { href: string; name: string };
  index: number;
}
const TechnologyStackDescription: React.SFC<TSDIProps> = props => {
  const [status, setStatus] = React.useState('default');
  const { index, value } = props;

  const render = React.useMemo(
    () => (
      <Col
        span={6}
        key={index}
        onMouseEnter={setStatus.bind(this, 'processing')}
        onMouseLeave={setStatus.bind(this, 'default')}
      >
        <a href={value.href} rel="noopener noreferrer">
          <Badge status={status} />
          {value.name}
        </a>
      </Col>
    ),
    [status]
  );

  return render;
};

const About: React.FC<IProps> = props => {
  const { t } = props;

  const dateFormater = {
    zh: 'yyyy 年 mm 月 dd 日',
    en: 'dddd mmm dd yyyy',
  }[props.i18n.language === 'zh-CN' ? 'zh' : 'en'];

  const render = React.useMemo(
    () => (
      <div className={'container-about'}>
        <Descriptions className={'container-about-description'} title={t('关于')} bordered>
          <Descriptions.Item label={t('项目名称')} span={2}>
            {t('书籍管理系统')}
          </Descriptions.Item>
          <Descriptions.Item label={t('创建日期')}>
            {dateFormat(new Date('2020-07-19'), dateFormater)}
          </Descriptions.Item>
          <Descriptions.Item label={t('前端研发')}>王钦弘</Descriptions.Item>
          <Descriptions.Item label={t('Node 端研发')}>王钦弘</Descriptions.Item>
          <Descriptions.Item label={t('Server 研发')}>王钦弘</Descriptions.Item>
          <Descriptions.Item span={3} label={t('前端技术栈')}>
            <Row gutter={32}>
              {FrontendTechnologyStack.map((value, index) => (
                <TechnologyStackDescription key={index} value={value} index={index} />
              ))}
            </Row>
          </Descriptions.Item>
          <Descriptions.Item span={3} label={t('后端技术栈')}>
            <Row gutter={32}>
              {BackendTechnologyStack.map((value, index) => (
                <TechnologyStackDescription key={index} value={value} index={index} />
              ))}
            </Row>
          </Descriptions.Item>
        </Descriptions>
      </div>
    ),
    [props.i18n.language]
  );

  return render;
};

export default withTranslation()(About);
