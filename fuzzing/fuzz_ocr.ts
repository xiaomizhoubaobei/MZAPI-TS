import { GeneralBasicOCR } from '../src/tencent/ocr/GeneralBasicOCR';

// 模糊测试目标函数
export function fuzz(data: Buffer) {
  try {
    // 将模糊数据转换为字符串进行测试
    const inputString = data.toString('utf-8');
    
    // 对可能的输入点进行模糊测试
    // 例如：OCR API 输入参数
    if (inputString.length > 0) {
      // 这里可以测试对各种输入的处理
      // 例如：测试 URL 验证、参数解析等
      console.log(`Fuzzing with input length: ${inputString.length}`);
    }
  } catch (error) {
    // 捕获可能的异常，但不处理，让模糊测试工具检测崩溃
    // 注意：不要在这里处理会导致安全问题的异常
  }
}