# 贡献指南

感谢您对本项目的关注和支持！我们欢迎任何形式的贡献，包括但不限于代码、文档、bug 报告和功能建议。

## 如何贡献

1. Fork 项目到您的 GitHub 账户
2. 克隆您的 Fork 到本地开发环境
3. 创建新的分支进行开发
4. 提交更改并推送至您的 Fork
5. 发起 Pull Request 请求合并到主仓库

## 开发环境设置

1. 确保已安装 Node.js (>=14.0.0)
2. 本项目推荐使用 Yarn 作为包管理器
3. 运行 `yarn install`  安装依赖
4. 使用 `yarn build` 编译项目

## 代码风格

- 遵循项目中已有的代码风格
- 使用 ESLint 和 Prettier 进行代码格式化
- 确保所有测试通过后再提交

### ESLint 规则

本项目使用 ESLint 进行代码质量控制，主要规则包括：
- 不允许使用 `any` 类型（除非必要）
- 不允许定义未使用的变量
- 禁止使用 `console` 和 `debugger`
- 不允许有重复的导入

### Prettier 规则

本项目使用 Prettier 进行代码格式化，规则包括：
- 使用单引号
- 行尾加分号
- 行宽限制为 100
- 使用 2 个空格缩进
- 对象括号内保持空格

## 提交规范

- 提交信息应清晰描述变更内容
- 使用英文编写提交信息
- 遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范

### 提交类型

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响代码逻辑）
- `refactor`: 代码重构（既不修复 bug 也不添加功能）
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

## 报告 Bug

请使用 GitHub Issues 来报告 Bug，提供详细的复现步骤和环境信息。

## 建议新功能

同样使用 GitHub Issues 来提议新功能，说明功能的用途和预期行为。