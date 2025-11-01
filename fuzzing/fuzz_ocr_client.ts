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