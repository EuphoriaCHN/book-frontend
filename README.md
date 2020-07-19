## 携带了 i18n 快速国际化功能

### `npm run i18n` --- 一键式国际化

`npm run i18n-gen && node ./configs/GoogleTranslate/index.js`

- `./configs/GoogleTranslate/index.js` 配置谷歌机翻，内部替换文件至 .cn 域，无需科学上网

### `npm run i18n-gen` --- 构建源文案 key json 文件

`./node_modules/.bin/i18next-scanner --config ./configs/i18n-scanner.config.js --output ./ './src/**/*.{js,jsx,ts,tsx}' && node ./configs/auto-format-zh.js`

- `./configs/i18n-scanner.config.js` scanner 扫描配置文件
- `./configs/auto-format-zh.js` 自动构建中文源文案 -> 翻译文案

> **这里我们假设了所有的 key 都是中文**，至于其他语言的 key，可以自行尝试

### `npm run clear-locale` --- 清空翻译语言数据，但维护了 webpack 打包稳定

- `./configs/auto-clear-locale.js` 用 `{}` 去替换 locale json 文件

## 增加语言注意

1. 修改 `/src/common/constants/locales.js` 为项目增加语言
2. 修改 `/src/common/constants/antdLocale.js` 为 AntD 增加翻译语言
3. 修改 `/src/i18n.js` 增加读取的 JSON 文件以及 i18n resource
4. 修改 `/configs/i18n-scanner.config.js` 增加抓取语言
5. 修改 `/configs/GoogleTranslate/config.js` 为 Google 翻译增加对应语言项

> 若想让项目成功运行，至少要运行一次 `npm run i18n-gen` 生成对应语言的 JSON 下拉文件（否则 webpack 会找不到 json 文件而报错）
