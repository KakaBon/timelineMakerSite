# 网页版时间轴制作工具

## 简介

这是一个基于 Vite 和 vis-timeline 的网页版时间轴制作工具，借助AI开发。

项目包含以下主要功能：

- 通过导入csv文件将事件呈现在时间轴上
- 导入和导出 CSV 文件
- csv数据内容的增删改查及时间轴上事件信息的实时更新
- 数据文本查找替换和事件查找功能
- 缩放和拖拽时间轴
- 事件类别的泳道显示和颜色区分
- 事件上鼠标悬浮查看更多信息

对于这个工具可以：
- 在线使用 kakabon.github.io/timelineMakerSite/
- 下载或克隆到本地后直接点击根目录的 run.bat 拉起服务并在浏览器中打开 http:// localhost:5173 使用，前提是已有node环境+在根目录运行`npm install` 安装依赖
- 下载或克隆到本地按需开发



![网页版时间轴制作工具上部功能区](./public/images/网页版时间轴制作工具上部功能区.png)

![网页版时间轴制作工具中部轴1区](./public/images/网页版时间轴制作工具中部轴1区.png)

![网页版时间轴制作工具下部轴2区](./public/images/网页版时间轴制作工具下部轴2区.png)


## Acknowledgements

This project is built upon several open-source projects.

- vis-timeline
  https://github.com/visjs/vis-timeline

- Vite
  https://vite.dev/

Please refer to the original repositories for license information.