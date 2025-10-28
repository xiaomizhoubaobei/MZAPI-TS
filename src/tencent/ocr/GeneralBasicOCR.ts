/*!
 * MZAPI TypeScript SDK
 * Copyright (C) 2025-present Qixiaoxiao <qixiaoxin@stu.sqxy.edu.cn>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { TencentCloudAuth } from '../../utils/txauth';
import { GeneralBasicOCRRequest, GeneralBasicOCRResponse } from '../../type';

/**
 * 自定义错误类，用于表示OCR相关的特定错误
 */
export class OCRError extends Error {
  constructor(message: string, public readonly code?: string, public readonly details?: any) {
    super(message);
    this.name = 'OCRError';
  }
}

/**
 * 通用印刷体OCR客户端配置
 */
export interface GeneralBasicOCRClientConfig {
  /**
   * 腾讯云SecretId
   */
  secretId: string;
  
  /**
   * 腾讯云SecretKey
   */
  secretKey: string;
  
  /**
   * 区域，默认为ap-beijing
   */
  region?: string;
  
  /**
   * 端点URL，默认为https://ocr.tencentcloudapi.com
   */
  endpoint?: string;
}

/**
 * 通用印刷体OCR客户端
 */
export class GeneralBasicOCRClient {
  private auth: TencentCloudAuth;
  private endpoint: string = 'https://ocr.tencentcloudapi.com';
  private service: string = 'ocr';
  private version: string = '2018-11-19';
  private region: string = 'ap-beijing';

  /**
   * 构造函数
   * @param config 客户端配置，包含secretId和secretKey
   */
  constructor(config: GeneralBasicOCRClientConfig) {
    this.auth = new TencentCloudAuth({
      secretId: config.secretId,
      secretKey: config.secretKey
    });
  }
    /**
     * 通用印刷体OCR
   * 
   * 对图片进行通用印刷体OCR识别，返回图片中的文字内容和位置信息。
   * 
   * @param req 通用印刷体OCR请求参数
   * @param cb 回调函数，可选
   * @returns Promise<GeneralBasicOCRResponse>
   */
  public async GeneralBasicOCR(
    req: GeneralBasicOCRRequest,
    cb?: (error: OCRError | null, rep: GeneralBasicOCRResponse) => void
  ): Promise<GeneralBasicOCRResponse> {
    let timeoutId: NodeJS.Timeout | undefined;
    
    try {
      // 生成鉴权签名
      const headers = this.auth.generateAuthorization({
        method: 'POST',
        url: this.endpoint,
        payload: req,
        service: this.service,
        action: 'GeneralBasicOCR',
        version: this.version,
        region: this.region
      });

      // 设置请求超时
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

      // 发起请求
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(req),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      timeoutId = undefined;

      // 检查HTTP响应状态
      if (!response.ok) {
        throw new OCRError(
          `HTTP Error: ${response.status} ${response.statusText}`,
          `HTTP_${response.status}`,
          { status: response.status, statusText: response.statusText }
        );
      }

      // 解析响应
      const result: any = await response.json();
      
      // 检查腾讯云API是否返回错误
      if (result.Error) {
        throw new OCRError(
          result.Error.Message || 'API Error',
          result.Error.Code || 'API_ERROR',
          result.Error
        );
      }
      
      // 腾讯云API响应格式为 { Response: { ... } }，需要提取Response字段
      if (!result.Response) {
        throw new OCRError('Invalid API response format', 'INVALID_RESPONSE', result);
      }
      
      const typedResult = result.Response as GeneralBasicOCRResponse;

      // 执行回调函数
      if (cb) {
        cb(null, typedResult);
      }

      return typedResult;
    } catch (error) {
      // 清除超时定时器
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      // 创建统一的错误对象
      let ocrError: OCRError;
      
      if (error instanceof OCRError) {
        ocrError = error;
      } else if (error instanceof Error) {
        // 处理原生Error对象
        if (error.name === 'AbortError') {
          ocrError = new OCRError('Request timeout', 'TIMEOUT');
        } else {
          ocrError = new OCRError(error.message, 'UNKNOWN_ERROR', { originalError: error });
        }
      } else {
        // 处理其他类型的错误
        ocrError = new OCRError('Unknown error', 'UNKNOWN_ERROR', { originalError: error });
      }
      
      // 执行回调函数
      if (cb) {
        cb(ocrError, {} as GeneralBasicOCRResponse);
        return {} as GeneralBasicOCRResponse;
      }

      // 重新抛出错误供上层处理
      throw ocrError;
    }
  }
}