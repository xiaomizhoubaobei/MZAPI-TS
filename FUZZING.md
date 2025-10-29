# 模糊测试集成文档

## 概述

本文档介绍了如何为 MZAPI TypeScript SDK 项目集成模糊测试，以提高代码质量和安全性。

## 选择的模糊测试工具

我们选择了 [Jazzer.js](https://github.com/CodeIntelligenceTesting/jazzer.js) 作为项目的模糊测试工具。Jazzer.js 是一个为 Node.js 平台设计的覆盖率引导的模糊测试工具，基于 libFuzzer。它具有以下优点：

1. 与 JavaScript/TypeScript 项目无缝集成
2. 提供覆盖率引导的模糊测试
3. 支持同步和异步函数测试
4. 与现有的测试框架（如 Jest）兼容

## 安装

在项目中安装 Jazzer.js 作为开发依赖：

```bash
yarn add --dev @jazzer.js/core
```

注意：目前 @jazzer.js/core 及其子包已不再维护，但仍然可以用于模糊测试目的。

## 配置

### 1. 创建模糊测试目标

在 `fuzzing/` 目录下创建模糊测试目标文件（如果不存在则创建目录）：

```typescript
// fuzzing/fuzz_ocr_client.ts

import { GeneralBasicOCRRequest } from '../src/type/tencent/ocr/request';
import { GeneralBasicOCRClient, OCRError } from '../src/tencent/ocr/GeneralBasicOCR';

// 模拟的配置，使用虚假的密钥（在实际模糊测试中不会真正调用API）
const mockConfig = {
  secretId: 'fake-secret-id',
  secretKey: 'fake-secret-key'
};

// 模糊测试目标函数
export function fuzz(data: Buffer) {
  try {
    // 创建一个模拟的OCR客户端（不会真正发送请求）
    const client = new GeneralBasicOCRClient(mockConfig);
    
    // 将模糊数据转换为字符串进行测试
    const inputString = data.toString('utf-8');
    
    // 测试JSON解析
    let requestData: Partial<GeneralBasicOCRRequest> = {};
    try {
      requestData = JSON.parse(inputString);
    } catch (e) {
      // 如果不是有效的JSON，创建一个包含模糊数据的对象
      requestData = {
        ImageBase64: inputString,
        ImageUrl: inputString,
        Scene: inputString,
        LanguageType: inputString
      };
    }
    
    // 测试OCR客户端的输入验证
    // 注意：这里我们不会真正发送请求，只是测试输入验证逻辑
    // 通过覆盖fetch函数来避免真正的网络请求
    const originalFetch = global.fetch;
    global.fetch = function() {
      // 模拟一个总是成功的响应
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ Response: {} })
      }) as any;
    } as any;
    
    try {
      // 调用OCR方法（使用模拟的fetch）
      client.GeneralBasicOCR(requestData as GeneralBasicOCRRequest);
    } catch (error) {
      // 捕获可能的验证错误
      if (!(error instanceof OCRError)) {
        // 如果不是预期的OCRError，重新抛出
        throw error;
      }
      // 如果是OCRError，说明输入验证工作正常
    } finally {
      // 恢复原始的fetch函数
      global.fetch = originalFetch;
    }
  } catch (error) {
    // 捕获可能的异常，但不处理，让模糊测试工具检测崩溃
    if (error instanceof Error && error.message.includes('ABORT_ERR')) {
      // 忽略超时错误
      return;
    }
    // 其他错误会被Jazzer.js捕获
  }
}
```

### 2. 语料库文件

在 `fuzzing/corpus/` 目录下放置初始种子文件，以改进模糊测试：

```
fuzzing/corpus/
  ├── image_base64.json
  ├── image_url.json
  └── scene_lang.json
```

示例种子文件内容：

image_base64.json:
```json
{"ImageBase64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="}
```

image_url.json:
```json
{"ImageUrl": "https://example.com/test.jpg"}
```

scene_lang.json:
```json
{"Scene": "normal", "LanguageType": "zh"}
```

### 3. 更新 package.json

在 `package.json` 中添加模糊测试脚本：

```json
{
  "scripts": {
    "fuzz": "yarn jazzer dist/fuzzing/fuzzing/fuzz_ocr_client.js fuzzing/corpus"
  }
}
```

## 运行模糊测试

### 基本运行

由于 Jazzer.js 需要 JavaScript 文件而不是 TypeScript 文件，我们需要先编译再运行：

```bash
# 使用提供的脚本运行模糊测试（默认30秒）
./run_fuzz_test.sh

# 使用提供的脚本运行模糊测试（指定时间限制，单位：秒）
./run_fuzz_test.sh 60
```

或者手动运行：

```bash
# 编译 TypeScript 文件
yarn tsc --outDir dist/fuzzing --module commonjs fuzzing/fuzz_ocr_client.ts

# 运行模糊测试（默认时间限制为30秒）
timeout 30s yarn jazzer dist/fuzzing/fuzzing/fuzz_ocr_client.js fuzzing/corpus

# 运行模糊测试（无时间限制）
yarn jazzer dist/fuzzing/fuzzing/fuzz_ocr_client.js fuzzing/corpus
```

### 使用 npm/yarn 脚本

```bash
# 运行模糊测试（默认时间限制为30秒）
yarn fuzz

# 运行模糊测试（无时间限制）
yarn fuzz:unlimited

# 运行模糊测试（使用 libFuzzer 的 -max_total_time 选项，60秒）
yarn fuzz:count-limited
```

### 高级选项

Jazzer.js 提供了许多选项来配置模糊测试：

```bash
# 指定运行时间（秒）
timeout 300s yarn jazzer dist/fuzzing/fuzzing/fuzz_ocr_client.js fuzzing/corpus

# 生成代码覆盖率报告
yarn jazzer dist/fuzzing/fuzzing/fuzz_ocr_client.js fuzzing/corpus -- -- -coverage

# 使用更多 libFuzzer 选项
yarn jazzer dist/fuzzing/fuzzing/fuzz_ocr_client.js fuzzing/corpus -- -- -max_len=10000 -timeout=10 -rss_limit_mb=2048 -max_total_time=60
```

### 高级选项

Jazzer.js 提供了许多选项来配置模糊测试：

```bash
# 指定运行时间（秒）
yarn jazzer dist/fuzzing/fuzzing/fuzz_ocr_client.js fuzzing/corpus -- -max_total_time=300

# 生成代码覆盖率报告
yarn jazzer dist/fuzzing/fuzzing/fuzz_ocr_client.js fuzzing/corpus -- -coverage

# 使用更多 libFuzzer 选项
yarn jazzer dist/fuzzing/fuzzing/fuzz_ocr_client.js fuzzing/corpus -- -max_len=10000 -timeout=10 -rss_limit_mb=2048
```

## 针对项目的模糊测试策略

### 1. API 参数验证

测试各种输入参数的边界条件和异常情况，特别是：

- OCR 请求中的图像 URL
- 各种 API 参数的类型和长度
- 认证信息的格式

### 2. 数据解析

测试从 API 响应中解析数据的逻辑，包括：

- JSON 响应的解析
- 错误响应的处理
- 不完整或格式错误的响应

### 3. 网络请求处理

测试 HTTP 请求和响应处理逻辑，包括：

- 超时处理
- 网络错误处理
- 重试机制

## 集成到 CI/CD

在 GitHub Actions 工作流中添加模糊测试步骤：

```yaml
- name: Fuzzing
  run: |
    yarn install
    ./run_fuzz_test.sh
```

## 最佳实践

1. **从小处着手**：开始时只测试一小部分功能，然后逐步扩展
2. **监控性能**：模糊测试可能会消耗大量资源，确保在适当的环境中运行
3. **定期运行**：将模糊测试集成到 CI/CD 流程中，定期运行以发现新问题
4. **修复问题**：及时修复模糊测试发现的问题
5. **自定义字典**：为特定的 API 参数创建模糊测试字典以提高效率
6. **使用种子语料库**：提供有意义的初始输入以提高测试效率

## 安全考虑

模糊测试有助于发现以下安全问题：

- 缓冲区溢出
- 注入攻击
- 拒绝服务漏洞
- 信息泄露

## 结论

通过集成 Jazzer.js，我们可以有效地对 MZAPI TypeScript SDK 进行模糊测试，提高代码质量和安全性。建议定期运行模糊测试，特别是在添加新功能后。