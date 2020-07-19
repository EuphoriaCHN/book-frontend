import i18n from '../../i18n';

const locale = {
  'zh-CN': i18n.t('简体中文'),
  'en-US': i18n.t('英语'),
};

const obj = {};

for (const key in locale) {
  Object.defineProperty(obj, key, {
    get() {
      return i18n.t(locale[key]);
    },
    enumerable: true,
  });
}

export const LOCALE = obj;
