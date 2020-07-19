/**
 * i18n collect config
 *
 * @author Wang Qinhong
 * @copyright XUST KCSoft
 */

'use strict';

const fs = require('fs');
const chalk = require('chalk');

module.exports = {
  options: {
    debug: true,
    func: {
      list: ['i18next.t', 'i18n.t', 'props.t', 't'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    trans: false,
    lngs: ['zh-CN', 'en-US'],
    defaultLng: 'zh',
    resource: {
      loadPath: './src/common/locales/{{lng}}.json',
      savePath: './src/common/locales/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    removeUnusedKeys: true,
    nsSeparator: true,
    keySeparator: true,
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
};
