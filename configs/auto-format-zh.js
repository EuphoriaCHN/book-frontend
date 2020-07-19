/**
 * 自动格式化中文 i18n 文案
 *
 * @author Wang Qinhong
 * @copyright XUST KCSoft
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const LOCALE_PATH = path.resolve(__dirname, '../', 'src', 'common', 'locales');

const file = fs.readFileSync(path.join(LOCALE_PATH, 'zh-CN.json'), 'utf-8');
const data = JSON.parse(file);

for (const key in data) {
  data[key] = key;
}

fs.writeFileSync(path.join(LOCALE_PATH, 'zh-CN.json'), JSON.stringify(data, null, 2));

console.log(chalk.yellow('抓取 i18n 成功，初始化中文成功'));
console.log(chalk.yellowBright('✨Euphoria Happy Every Day✨'));
