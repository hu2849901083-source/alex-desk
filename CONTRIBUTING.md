# 贡献指南

感谢你帮助“每日专注主页”变得更稳定、清晰和易用。

## 提交问题

请提供：

- Obsidian 版本、插件版本、操作系统版本
- 可复现步骤、期望结果与实际结果
- 不包含私人笔记或路径的截图、示例 Markdown
- 与问题相关的开发者控制台错误信息

安全漏洞不要公开提交，请遵循 [SECURITY.md](SECURITY.md)。

## 代码贡献

1. Fork 仓库并从默认分支创建主题分支。
2. 安装依赖：`npm install`。
3. 只修改 `src/` 中的源码和 `styles.css`，然后运行 `npm run build`。
4. 运行 `npm run check`，并在亮色、暗色、窄窗口下测试。
5. 不提交私人配置、仓库内容、`node_modules/` 或 `dist/`。
6. Pull Request 中说明行为变化、验证结果和必要截图。

## 设计原则

- 文字和行动优先，装饰不争夺第一眼。
- 所有统计都应能解释口径并追溯到来源笔记。
- 默认本地处理，不增加遥测或不必要的网络请求。
- 动效必须有反馈意义，并适配减少动态效果。
- 新功能应避免重复文件树、原生日历等现有入口。

## 版本与发布

任何对外修改都必须提升语义化版本号，并同步更新 `manifest.json`、`package.json`、`package-lock.json`、`versions.json` 和 `CHANGELOG.md`。完整步骤见 [PUBLISHING.md](PUBLISHING.md)。
