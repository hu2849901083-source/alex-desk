# 社区目录提交资料

## 基本信息

- 插件名称：每日专注主页
- 插件 ID：`alex-desk`
- 作者：Alex
- 仓库：`hu2849901083-source/alex-desk`
- 当前候选版本：`1.10.21`
- 最低 Obsidian 版本：`1.7.2`
- 平台：仅桌面端
- 许可证：MIT；第三方部分见 `THIRD_PARTY_NOTICES.md`

## 市场短描述

```text
中文本地主页，汇总每日笔记、Markdown 待办、写作字数、热力图与人生日期回看.
```

## 功能摘要

每日专注主页将仓库内的每日笔记、分散待办、写作数据、记录热力图和日期回看汇总到一个中文主页。所有数据在本地处理，统计结果可以回到来源笔记；系统音频频谱为默认关闭的可选视觉功能。

## 权限与隐私披露

- 读取仓库 Markdown 文件以生成内容和统计。
- 用户点击完成待办时修改相应 Markdown 文件。
- 用户选择头像时在仓库内保存图片。
- 不收集遥测，不上传笔记，不执行远程代码。
- Windows 可选音频频谱会启动隐藏 PowerShell 进程，只读取系统输出峰值，不录音、不保存、不识别内容。

## 提交前确认

- [ ] 默认分支根目录的 `manifest.json` 为 `1.10.21`
- [ ] GitHub Release 标签严格为 `1.10.21`
- [ ] Release 包含独立的 `main.js`、`manifest.json`、`styles.css`
- [ ] README 有用途、安装、使用和隐私说明
- [ ] LICENSE 与第三方许可证说明齐全
- [ ] GitHub Issues 已开启
- [ ] 使用干净仓库完成安装测试
- [ ] 已阅读 Obsidian Developer policies 与 Plugin guidelines
