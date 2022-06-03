# VSCode 开启保存自动 Prettier
全局安装
```shell
npm install --global prettier
```
项目根目录新建 `.prettierrc.js`
```js
// 配置可参考 https://www.prettier.cn/docs/configuration.html
module.exports = {
  // 使用较大的打印宽度，因为 Prettier 的换行设置似乎是针对没有注释的 JavaScript.
  printWidth: 110,

  // 使用 .gitattributes 来管理换行
  endOfLine: 'auto',

  // 单引号代替双引号
  singleQuote: true,

  // 对于 ES5 而言, 尾逗号不能用于函数参数，因此使用它们只能用于数组
  trailingComma: 'none'
};

```
忽略格式化的文件，根目录下新建 `.prettierignore`
```
#-------------------------------------------------------------------------------------------------------------------
# 保持与 .gitignore 同步
#-------------------------------------------------------------------------------------------------------------------

👋 (此处将你的 .gitignore 文件内容复制粘贴过来) 👋

#-------------------------------------------------------------------------------------------------------------------
# Prettier 通用配置
#-------------------------------------------------------------------------------------------------------------------

# Rush 文件
common/changes/
common/scripts/
common/config/
CHANGELOG.*

# 包管理文件
pnpm-lock.yaml
yarn.lock
package-lock.json
shrinkwrap.json

# 构建产物
dist
lib

# 在 Markdown 中，Prettier 将会对代码块进行格式化，这会影响输出
*.md
```

1.(安装 Prettier 插件)[https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode]
2.打开 `settings.json`
 - `window`: ctrl + p，输入 `settings.json`
 - `mac`: cmd + p，输入 `settings.json`
> 添加以下配置
```json
{
  "editor.formatOnSave": true,
}
```
3.打开 settings
 - `window`: ctrl + , 搜索 `editor.default`，并设置为 Prettier