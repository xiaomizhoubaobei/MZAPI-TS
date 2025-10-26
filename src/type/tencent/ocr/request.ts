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

/**
 * 通用印刷体OCR请求参数
 * 
 * 支持PNG、JPG、JPEG、BMP、PDF格式的图片/PDF识别
 * 图片/PDF经Base64编码后不超过 10M，分辨率建议600*800以上
 */
export interface GeneralBasicOCRRequest {
  /**
   * 图片/PDF的 Base64 值
   * 
   * 要求图片/PDF经Base64编码后不超过 10M，分辨率建议600*800以上，
   * 支持PNG、JPG、JPEG、BMP、PDF格式。
   * 
   * 图片的 ImageUrl、ImageBase64 必须提供一个，如果都提供，只使用 ImageUrl。
   * 
   * 示例值：/9j/4AAQSkZJRg.....s97n//2Q==
   */
  ImageBase64?: string;

  /**
   * 图片/PDF的 Url 地址
   * 
   * 要求图片/PDF经Base64编码后不超过 10M，分辨率建议600*800以上，
   * 支持PNG、JPG、JPEG、BMP、PDF格式。
   * 
   * 图片下载时间不超过 3 秒。图片存储于腾讯云的 Url 可保障更高的下载速度和稳定性，
   * 建议图片存储于腾讯云。非腾讯云存储的 Url 速度和稳定性可能受一定影响。
   * 
   * 示例值：https://ocr-demo-1254418846.cos.ap-guangzhou.myqcloud.com/general/GeneralBasicOCR/GeneralBasicOCR1.jpg
   */
  ImageUrl?: string;

  /**
   * 保留字段
   * 
   * 示例值：scene
   */
  Scene?: string;

  /**
   * 识别语言类型
   * 
   * 支持自动识别语言类型，同时支持自选语言种类，默认中英文混合(zh)，
   * 各种语言均支持与英文混合的文字识别。
   * 
   * 可选值：
   * - zh：中英混合
   * - zh_rare：支持英文、数字、中文生僻字、繁体字，特殊符号等
   * - auto：自动
   * - mix：多语言混排场景中,自动识别混合语言的文本
   * - jap：日语
   * - kor：韩语
   * - spa：西班牙语
   * - fre：法语
   * - ger：德语
   * - por：葡萄牙语
   * - vie：越语
   * - may：马来语
   * - rus：俄语
   * - ita：意大利语
   * - hol：荷兰语
   * - swe：瑞典语
   * - fin：芬兰语
   * - dan：丹麦语
   * - nor：挪威语
   * - hun：匈牙利语
   * - tha：泰语
   * - hi：印地语
   * - ara：阿拉伯语
   * 
   * 示例值：zh
   */
  LanguageType?: string;

  /**
   * 是否开启PDF识别，默认值为false，开启后可同时支持图片和PDF的识别
   * 
   * 示例值：true
   */
  IsPdf?: boolean;

  /**
   * 需要识别的PDF页面的对应页码，仅支持PDF单页识别，
   * 当上传文件为PDF且IsPdf参数值为true时有效，默认值为1
   * 
   * 示例值：1
   */
  PdfPageNumber?: number;

  /**
   * 是否返回单字信息，默认关
   * 
   * 示例值：false
   */
  IsWords?: boolean;
}