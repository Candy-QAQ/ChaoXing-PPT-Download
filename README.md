# 超星学习通课件下载器

一个简洁的浏览器插件，用于下载超星学习通平台上的 PPT/Word/PDF 课件。

## 安装步骤

1. 下载 `ChaoXing-PPT-Download.zip` 并解压
2. 确认以下文件都在同一文件夹中：
   - `manifest.json`
   - `background.js`
   - `content.js`
   - `injected_spy.js`
   - `logo.png`
3. 打开浏览器扩展管理页面：
   - Edge: `edge://extensions`
   - Chrome: `chrome://extensions`
4. 开启 **开发者模式**
5. 点击 **加载已解压的扩展**
6. 选择你存放插件文件的文件夹

## 使用方法

1. 安装成功后，打开超星学习通的章节页面
2. 进入含有 PPT/Word/PDF 预览的页面
3. 按下 **F5** 键刷新页面
4. 如果页面中有课件，右上角会出现**绿色的下载按钮**，并完整显示课件名称
5. 点击下载按钮会直接调用浏览器下载，不再新开标签页
6. 下载后的文件名与绿色按钮显示的课件名称保持一致

## 效果演示

![演示](demo.png)
