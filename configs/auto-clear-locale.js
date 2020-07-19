const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const LOCALE_PATH = path.resolve(__dirname, '../', 'src', 'common', 'locales');

const files = fs.readdirSync(LOCALE_PATH);

for (let n = 0; n < files.length; n++) {
  const filePath = path.join(LOCALE_PATH, files[n]);
  fs.writeFileSync(filePath, '{}', 'utf-8');
}

console.log(chalk.cyan('🧹 清除旧语言数据成功 🧹'));
