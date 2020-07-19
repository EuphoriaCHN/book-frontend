const path = require('path');

const SOURCE_PATH = path.resolve(__dirname, '../../', 'src', 'common', 'locales');

const cf = {
  sourceCodePath: SOURCE_PATH, // 源代碼路徑\\pages
  skipEnglishKey: true, // 當key為全英文時,是否跳過翻譯
  languages: ['en-US', 'zh-CN'], // 需要翻譯的語言
  patterns: {
    0: /(?<=\$t(\s*)\((\s*)("|'))[^'|"]+/g,
  },
  skipPath: [
    // 需要跳過的路徑(完整路徑,不區分大小寫)
  ],
  skipFolderName: [
    // 需要跳過的文件夾(文件夾名稱,不區分大小寫)
    'node_modules',
  ],
  // Mode: Create/Append
  Mode: 'Create',
};

exports.cf = cf;
