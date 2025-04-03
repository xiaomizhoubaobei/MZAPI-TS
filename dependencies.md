# MZAPI 项目依赖说明

本文档详细说明了MZAPI项目的依赖包信息，包括生产环境依赖和开发环境依赖。

## 生产环境依赖

这些依赖包在生产环境中是必需的：

### 核心依赖

- **@babel/core** (^7.26.0)
  - Babel的核心功能，用于JavaScript代码转换
  - 负责解析和转换现代JavaScript代码

### 云服务SDK

- **@huaweicloud/huaweicloud-sdk-core** (^3.1.140)
  - 华为云SDK核心库
  - 提供华为云服务的基础功能支持

- **@huaweicloud/huaweicloud-sdk-kms** (^3.1.128)
  - 华为云密钥管理服务(KMS) SDK
  - 用于密钥管理和加密操作

### 网络请求

- **axios** (^1.8.3)
  - 基于Promise的HTTP客户端
  - 用于发起HTTP请求和处理响应

### 文档和API

- **docdash** (^2.0.2)
  - JSDoc文档主题
  - 用于生成API文档

- **express** (^4.21.2)
  - Web应用框架
  - 用于构建API服务

### 监控和追踪

- **jaeger-client** (^3.19.0)
  - Jaeger分布式追踪客户端
  - 用于性能监控和问题诊断

### 工具库

- **json** (^11.0.0)
  - JSON处理工具
  - 提供JSON数据的解析和序列化功能

- **pnpm** (^10.6.5)
  - 高性能的包管理器
  - 用于管理项目依赖

## 开发环境依赖

这些依赖包仅在开发环境中使用：

### Babel相关

- **@babel/cli** (^7.26.4)
  - Babel命令行工具
  - 用于在命令行中运行Babel

- **@babel/plugin-proposal-object-rest-spread** (^7.14.7)
  - Babel插件
  - 支持对象的解构和展开语法

- **@babel/preset-env** (^7.26.9)
  - Babel预设环境
  - 根据目标环境自动确定需要的转换

- **@babel/preset-typescript** (^7.26.0)
  - TypeScript转换预设
  - 将TypeScript代码转换为JavaScript

### TypeScript相关

- **@types/express** (^4.17.21)
  - Express的TypeScript类型定义

- **@types/jaeger-client** (^3.18.7)
  - Jaeger客户端的TypeScript类型定义

- **@types/jest** (^29.5.14)
  - Jest的TypeScript类型定义

- **@types/node** (^20.11.24)
  - Node.js的TypeScript类型定义

### 代码质量

- **@typescript-eslint/eslint-plugin** (^7.1.1)
  - TypeScript的ESLint插件
  - 提供TypeScript特定的lint规则

- **@typescript-eslint/parser** (^7.1.1)
  - TypeScript的ESLint解析器
  - 使ESLint能够解析TypeScript代码

- **eslint** (^8.57.0)
  - JavaScript代码检查工具
  - 用于维护代码质量和统一代码风格

### 测试相关

- **jest** (^29.7.0)
  - JavaScript测试框架
  - 用于单元测试和集成测试

- **ts-jest** (^29.2.6)
  - Jest的TypeScript预处理器
  - 使Jest能够直接测试TypeScript代码

### 构建工具

- **rimraf** (^3.0.2)
  - 跨平台的rm -rf工具
  - 用于清理构建目录


- **typescript** (^5.4.2)
  - TypeScript编译器
  - 用于将TypeScript代码编译为JavaScript

## 版本要求

- Node.js版本要求: >=8.0.0

## 注意事项

1. 在安装依赖时，建议使用`pnpm install`以获得更好的性能和磁盘空间利用率
2. 开发时请确保Node.js版本符合要求
3. 如需贡献代码，请确保已安装所有开发环境依赖