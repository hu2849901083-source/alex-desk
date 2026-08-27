# 社区插件市场发布流程

本文适用于“每日专注主页”首次上架和后续更新。当前插件 ID 为 `alex-desk`，GitHub 仓库为 `hu2849901083-source/alex-desk`。

## 一、首次上架前准备

1. GitHub 仓库必须公开，默认分支建议使用 `main`。
2. 根目录必须包含 `README.md`、`LICENSE`、`manifest.json` 和 `versions.json`。
3. GitHub Issues 应保持开启；建议在 Security 设置中开启 Private vulnerability reporting。
4. `manifest.json` 中的 `id` 不再更改。展示名称可以更新，但 ID 决定安装目录和用户数据归属。
5. 因插件使用 Node.js、PowerShell 与系统音频能力，`isDesktopOnly` 必须为 `true`。

## 二、发布候选版检查

在仓库根目录运行：

```bash
npm ci
npm run build
npm run check
```

然后确认：

- `manifest.json`、`package.json`、`package-lock.json` 版本一致。
- `versions.json` 已添加当前版本及最低 Obsidian 版本。
- `CHANGELOG.md` 和 `RELEASE_NOTES.md` 已更新。
- 一个全新测试仓库仅安装 `main.js`、`manifest.json`、`styles.css` 后能正常启动。
- 系统音频频谱默认关闭，开启与关闭都会正确清理本地进程。
- GitHub 仓库中没有私人路径、私人图片、`data.json` 或笔记内容。

## 三、创建 GitHub Release

提交并推送所有文件后，创建一个与清单版本完全相同、没有 `v` 前缀的标签：

```bash
git tag -a 1.10.21 -m "1.10.21"
git push origin 1.10.21
```

仓库中的 GitHub Actions 会自动安装锁定依赖、构建单文件 `main.js`、检查版本、生成构建证明，并创建草稿 Release。打开 GitHub Releases，确认 `main.js`、`manifest.json`、`styles.css` 是三个独立附件，然后发布草稿。

## 四、提交到 Obsidian 社区目录

1. 登录 https://community.obsidian.md 。
2. 在个人资料中绑定拥有该仓库的 GitHub 账号。
3. 进入插件管理页面，选择添加新插件。
4. 填写仓库地址 `https://github.com/hu2849901083-source/alex-desk`。
5. 使用 [COMMUNITY_SUBMISSION.md](COMMUNITY_SUBMISSION.md) 中的资料核对名称、说明和隐私披露。
6. 阅读并确认 Obsidian Developer policies 后提交。

社区目录读取默认分支最新的 `manifest.json`，并寻找与其中版本完全同名的 GitHub Release。两者缺一不可。

## 五、处理审核反馈

自动审核可能重点检查：

- `child_process` 与 PowerShell 的必要性、默认关闭状态和隐私披露。
- 是否只使用本地音量峰值，是否录音或上传。
- 插件是否准确标记为桌面端专用。
- 事件监听器、计时器、媒体流和子进程是否在停用时清理。
- 是否存在危险 HTML 注入或不必要日志。

收到必须修改的反馈后，不要覆盖原 Release；提升补丁版本，例如 `1.10.22`，重新构建、打标签和发布。社区页面会再次扫描默认分支的最新版。

## 六、后续更新

插件首次通过后不需要重复申请。每次更新只需提升版本、构建测试、推送同名标签并发布自动生成的 GitHub Release，Obsidian 会向用户显示更新。
