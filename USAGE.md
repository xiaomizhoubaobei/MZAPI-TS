# MZAPI 使用方法

欢迎使用 `MZAPI`，这是一个基于 Node.js 的 SDK，旨在帮助开发者快速构建和接入米粥 API 服务。以下是如何使用本 SDK 的详细步骤和指南。

## 快速开始

在开始之前，请确保你已经安装了 Node.js 环境（推荐 v14 或更高版本）。然后，通过以下命令安装 `MZAPI`：

```bash
npm install mzapi
# 或者使用 yarn
yarn add mzapi
```
```

## API 认证

在使用 SDK 之前，你需要先获取 API 密钥。请按照以下步骤操作：

1. 访问 [千帆ModelBuilder控制台-应用列表](https://console.bce.baidu.com/qianfan/ais/console/applicationConsole/application/v1)
2. 注册/登录你的开发者账号
3. 在控制台创建新的应用
4. 获取应用的 API 密钥

## 版本更新

我们定期更新 `MZAPI` 以添加新功能和修复已知问题。请查看 [更新日志](CHANGELOG.md) 了解最新的变更。

## 注意事项

- 确保在使用 `MZAPI` 之前，你已经阅读了所有相关的文档，并理解了各个方法的参数和返回值
- API 密钥不要直接硬编码在代码中，建议使用环境变量或配置文件管理
- 注意处理 API 调用可能出现的错误情况
- 如果在使用过程中遇到任何问题，可以参考 [问题排查指南](TROUBLESHOOTING.md) 或者联系我们获取帮助

## 贡献

我们非常欢迎社区的贡献！如果你对项目感兴趣，欢迎通过以下方式参与：

- 提交问题报告和功能请求
- 提交代码改进和修复
- 改进文档和示例

更多信息请查看 [贡献指南](CONTRIBUTING.md)。

## 联系我们

如果你在使用 `MZAPI` 时遇到任何问题，或者有任何建议和反馈，欢迎通过以下方式联系作者：

- **姓名**：祁筱欣
- **开发者邮件**：[mzapi@x.mizhoubaobei.top](mailto:mzapi@x.mizhoubaobei.top)
- **项目网址**：[https://github.com/xiaomizhoubaobei/MZAPI](https://github.com/xiaomizhoubaobei/MZAPI)

我们希望这些信息能帮助你快速上手 `MZAPI`。感谢你的使用和支持！