/**
 * 格式化 node_modules google-translation-api
 *
 * @author Wang Qinhong
 * @copyright XUST KCSoft
 */

const path = require('path');
const fs = require('fs');

const initial = () => {
  const NODE_MODULES = path.resolve(__dirname, '../../', 'node_modules');

  const googleTranslateApiIndexFile = path.resolve(NODE_MODULES, 'google-translate-api', 'index.js');
  const googleTranslateApi = fs.readFileSync(googleTranslateApiIndexFile, 'utf-8');
  fs.writeFileSync(
    googleTranslateApiIndexFile,
    googleTranslateApi
      .replace(/https:\/\/translate.google.com/g, 'https://translate.google.cn')
      .replace(/client: 't',/g, "client: 'gtx',"),
    'utf-8'
  );

  const googleTranslateTokenIndexFile = path.join(NODE_MODULES, 'google-translate-token', 'index.js');
  const googleTranslateToken = fs.readFileSync(googleTranslateTokenIndexFile, 'utf-8');
  fs.writeFileSync(
    googleTranslateTokenIndexFile,
    googleTranslateToken.replace(/https:\/\/translate.google.com/g, 'https://translate.google.cn'),
    'utf-8'
  );
};

module.exports = initial;
