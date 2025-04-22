# MZAPI

[![Codacy Badge](https://app.codacy.com/project/badge/Grade/cf4fa41d39a647f8b2ffede82703fcdd)](https://app.codacy.com/gh/xiaomizhoubaobei/MZAPI-TS/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)

## 项目概述

MZAPI 是一个专为 TypeScript 开发者设计的 SDK，旨在简化与多种 API 服务的集成过程。目前主要提供百度文心大模型API的接入功能，让开发者能够高效、便捷地执行各类使用API得任务。

## 功能特性

- **简单易用**：提供简洁的API接口，快速实现AI对话功能
- **类型支持**：使用TypeScript开发，提供完整的类型定义
- **错误处理**：内置智能的错误处理机制，提供清晰的错误提示
- **自动令牌管理**：自动处理访问令牌的获取和刷新
- **参数验证**：API调用参数的自动验证，避免无效请求

## 安装指南

您可以通过 npm 轻松安装 MZAPI：

```bash
npm install MZAPI
```

## 使用示例

详细使用示例请见[示例代码](https://github.com/xiaomizhoubaobei/MZAPI/blob/master/JS/list.md)。

## API文档

### Ernie4_8K 类

主要的类和接口说明：

- `Ernie4_8K`: 百度文心大模型4.0-8K版本的API封装
- `Message`: 对话消息接口，包含role和content字段
- `APIResponse`: API响应数据接口，包含生成结果和token使用统计

详细的API文档请访问我们的[在线文档](https://api.mizhoubaobei.top)。

## 开发者贡献指南

我们诚挚邀请您为 MZAPI 项目贡献智慧与力量！请按照以下步骤参与贡献：

1. **Fork 仓库**：
   - 首先，在 GitHub 上 Fork 本项目至您的个人仓库。
     Github仓库地址：https://github.com/xiaomizhoubaobei/MZAPI-TS

2. **创建特性分支**：
   - 使用命令 `git checkout -b feature/YourFeatureName` 创建一个新的特性分支。

3. **提交更改**：
   - 在特性分支上进行代码修改，并使用 `git commit -m '描述您的更改'` 提交这些更改。

4. **推送分支**：
   - 使用 `git push origin feature/YourFeatureName` 将特性分支推送至您的 GitHub 仓库。

5. **提交 Pull Request**：
   - 最后，在 GitHub 上提交一个 Pull Request，以便我们将您的更改合并至主仓库。

## 许可证声明

MZAPI 项目遵循 MIT 许可证进行分发。有关许可证的详细信息，请参阅项目根目录下的 [LICENSE](LICENSE) 文件。