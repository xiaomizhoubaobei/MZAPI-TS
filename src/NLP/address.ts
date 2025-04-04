import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import iconv from 'iconv-lite';
import jschardet from 'jschardet';
import {TosRequest} from "../utils/tosRequest";

/**
 * 地址识别结果的地址元素接口
 */
interface AddressElement {
    type: string;          // 地址元素的类型
    pos: number;          // 元素在原文本中的位置
    length: number;       // 元素文本长度
    standard_value: string; // 标准化后的值
}

/**
 * 地址识别API的响应数据格式
 */
interface AddressResponse {
    /**
     * 待识别的文本内容
     * @remarks 不超过1000字节
     */
    text: string;
    province: string;       // 省份
    province_code: string;  // 省份编码
    city: string;          // 城市
    city_code: string;     // 城市编码
    county: string;        // 区县
    county_code: string;   // 区县编码
    town: string;          // 乡镇
    town_code: string;     // 乡镇编码
    detail: string;        // 详细地址
    phonenum: string;      // 电话号码
    person: string;        // 联系人
    postal_code: string;   // 邮编
    reliability: number;   // 可信度
    log_id: number;        // 日志ID
    address_elements: AddressElement[]; // 地址元素列表
}

/**
 * 地址识别类，用于解析和结构化分析中文地址文本
 */
export class AddressAnalyzer {
    private readonly auth: BaiduAuth;
    private readonly apiUrl: string = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/address';

    /**
     * 创建地址识别实例
     * @param {string} apiKey - 百度API的客户端ID
     * @param {string} secretKey - 百度API的客户端密钥
     * @throws {Error} 如果apiKey或secretKey为空，将抛出错误
     */
    constructor(apiKey: string, secretKey: string) {
        this.auth = new BaiduAuth(apiKey, secretKey);
    }

    async analyze(text: string): Promise<AddressResponse> {
        if (!text) {
            throw new Error('地址文本不能为空');
        }

        // 检测输入文本的编码
        const inputEncoding = this.detectEncoding(text);

        // 如果不是UTF-8或GBK，抛出错误
        if (inputEncoding !== 'UTF-8' && inputEncoding !== 'GBK') {
            throw new Error(`不支持的编码格式：${inputEncoding}，仅支持UTF-8和GBK编码`);
        }

        // 验证文本长度
        const byteLength = this.getByteLength(text);
        if (byteLength > 1000) {
            throw new Error(`地址文本超过长度限制：${byteLength} 字节（最大允许1000字节）`);
        }

        // 验证特殊字符
        if (this.hasSpecialCharacters(text)) {
            throw new Error('地址文本包含非法字符（如 <、>、{、}、[、]、\\）');
        }

        try {
            const token = await this.auth.getToken();

            // 如果是GBK编码，先转换为UTF-8发送请求
            const requestText = inputEncoding === 'GBK'
                ? this.convertEncoding(text, 'GBK', 'UTF-8')
                : text;

            const options: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.apiUrl}?access_token=${token}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    text: requestText
                }
            };

            const response = await axios(options);
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest(response);
            // 如果输入是GBK编码，将响应数据转换为GBK编码
            if (inputEncoding === 'GBK') {
                const convertedResponse = {...response.data};
                // 转换所有字符串类型的字段
                for (const key in convertedResponse) {
                    if (typeof convertedResponse[key] === 'string') {
                        convertedResponse[key] = this.convertEncoding(
                            convertedResponse[key],
                            'UTF-8',
                            'GBK'
                        );
                    }
                }
                // 特殊处理address_elements数组
                if (convertedResponse.address_elements) {
                    convertedResponse.address_elements = convertedResponse.address_elements.map(
                        (element: AddressElement) => ({
                            ...element,
                            type: this.convertEncoding(element.type, 'UTF-8', 'GBK'),
                            standard_value: this.convertEncoding(element.standard_value, 'UTF-8', 'GBK')
                        })
                    );
                }
                return convertedResponse;
            }

            return response.data;
        } catch (error) {
            throw new Error(`地址识别失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * 验证文本是否包含特殊字符
     * @param {string} text - 待验证的文本
     * @returns {boolean} 如果包含特殊字符返回true，否则返回false
     * @private
     */
    private hasSpecialCharacters(text: string): boolean {
        // 定义特殊字符正则表达式
        const specialCharsRegex = /[<>{}[\]\\]/;
        return specialCharsRegex.test(text);
    }

    /**
     * 获取字符串的字节长度
     * @param {string} str - 待计算的字符串
     * @returns {number} 字符串的字节长度
     * @private
     */
    private getByteLength(str: string): number {
        return new TextEncoder().encode(str).length;
    }

    /**
     * 检测文本编码
     * @param {string} text - 待检测的文本
     * @returns {string} 返回检测到的编码类型
     * @private
     */
    private detectEncoding(text: string): string {
        const result = jschardet.detect(text);
        return result.encoding.toUpperCase();
    }

    /**
     * 转换文本编码
     * @param {string} text - 待转换的文本
     * @param {string} fromEncoding - 源编码
     * @param {string} toEncoding - 目标编码
     * @returns {string} 返回转换后的文本
     * @private
     */
    private convertEncoding(text: string, fromEncoding: string, toEncoding: string): string {
        const buffer = iconv.encode(text, fromEncoding);
        return iconv.decode(buffer, toEncoding);
    }
}