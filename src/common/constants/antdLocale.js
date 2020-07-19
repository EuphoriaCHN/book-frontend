import Cookies from 'js-cookie';
import i18n from 'i18n';

// Antd 国际化方案
import zh from 'antd/es/locale/zh_CN';
import en from 'antd/es/locale/en_US';

const locale = i18n.language || 'zh-CN';

const antdLocaleConfigs = {
  'zh-CN': zh,
  'en-US': en,
};

export default antdLocaleConfigs[locale];
