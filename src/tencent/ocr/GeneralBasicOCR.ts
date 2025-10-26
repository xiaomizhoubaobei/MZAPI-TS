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
    cb?: (error: string | null, rep: GeneralBasicOCRResponse) => void
  ): Promise<GeneralBasicOCRResponse> {
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

      // 发起请求
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(req)
      });

      // 解析响应
      const result: any = await response.json();
      // 腾讯云API响应格式为 { Response: { ... } }，需要提取Response字段
      const typedResult = result.Response as GeneralBasicOCRResponse;

      // 执行回调函数
      if (cb) {
        cb(null, typedResult);
      }

      return typedResult;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // 执行回调函数
      if (cb) {
        cb(errorMessage, {} as GeneralBasicOCRResponse);
      }

      throw new Error(errorMessage);
    }
  }
}