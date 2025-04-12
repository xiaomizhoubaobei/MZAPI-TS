import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import {TosRequest} from "../utils/tosRequest";

/**
 * 情感倾向分析结果接口
 */
interface SentimentItem {
    /**
     * 表示情感极性分类结果
     * 0：负向
     * 1：中性
     * 2：正向
     */
    sentiment: number;
    /**
     * 表示分类的置信度，取值范围[0,1]
     */
    confidence: number;
    /**
     * 表示属于积极类别的概率
     */
    positive_prob: number;
    /**
     * 表示属于消极类别的概率
     */
    negative_prob: number;
}

interface SentimentResponse {
    /**
     * 输入的文本内容
     */
    text: string;
    /**
     * 情感分析结果数组
     */
    items: SentimentItem[];
    /**
     * 日志ID
     */
    log_id: number;
}

/**
 * 情感倾向分析类，用于分析文本的情感倾向
 */
export class SentimentAnalyzer {
    private readonly auth: BaiduAuth;
    private readonly apiUrl: string = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/sentiment_classify?charset=UTF-8';

    /**
     * 创建情感倾向分析实例
     * @param {string} apiKey - 百度API的客户端ID
     * @param {string} secretKey - 百度API的客户端密钥
     * @throws {Error} 如果apiKey或secretKey为空，将抛出错误
     */
    constructor(apiKey: string, secretKey: string) {
        this.auth = new BaiduAuth(apiKey, secretKey);
    }

    async analyze(text: string): Promise<SentimentResponse> {
        if (!text) {
            throw new Error('文本内容不能为空');
        }

        // 检测文本编码并在需要时进行转换
        const encoding = this.detectEncoding(text);
        if (encoding !== 'UTF-8') {
            text = this.convertToUTF8(text);
        }

        // 验证文本长度（最大支持2048字节）
        const byteLength = this.getByteLength(text);
        if (byteLength > 2048) {
            throw new Error(`文本超过长度限制：${byteLength} 字节（最大允许2048字节）`);
        }

        try {
            const token = await this.auth.getToken();

            const options: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.apiUrl}?access_token=${token}`,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json;charset=UTF-8',
                    'Accept-Charset': 'UTF-8'
                },
                data: {
                    text: text
                }
            };

            const response = await axios(options);
            const data = response.data;
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest(response.data);


            // 转换为新地返回格式
            return {
                text: text,
                items: [{
                    sentiment: data.sentiment,
                    confidence: data.confidence,
                    positive_prob: data.positive_prob,
                    negative_prob: data.negative_prob
                }],
                log_id: data.log_id
            };
        } catch (error) {
            throw new Error(`情感倾向分析失败: ${error instanceof Error ? error.message : String(error)}`);
        }
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
     * 分析文本的情感倾向
     * @param {string} text - 待分析的文本内容
     * @returns {Promise<SentimentResponse>} 返回情感分析结果
     * @throws {Error} 可能的错误：
     * - 文本为空
     * - 文本长度超过限制
     * - 网络连接失败
     * - API调用超时
     * - 无效的访问令牌
     * - 服务器端错误
     */
    /**
     * 检测文本编码
     * @param {string} text - 待检测的文本
     * @returns {string} 返回检测到的编码格式
     * @private
     */
    private detectEncoding(text: string): string {
        // 检查是否为有效的UTF-8编码
        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder('utf-8', {fatal: true});
            const encoded = encoder.encode(text);
            decoder.decode(encoded);
            return 'UTF-8';
        } catch (error) {
            // 如果解码失败，可能是其他编码
            console.warn('文本编码检测失败:', error);
            return 'unknown';
        }
    }

    /**
     * 将文本转换为UTF-8编码
     * @param {string} text - 待转换的文本
     * @returns {string} 返回UTF-8编码的文本
     * @private
     */
    private convertToUTF8(text: string): string {
        try {
            // 尝试将文本转换为UTF-8
            const encoder = new TextEncoder();
            const decoder = new TextDecoder('utf-8', {fatal: false});
            const encoded = encoder.encode(text);
            return decoder.decode(encoded);
        } catch (error) {
            // 如果转换失败，记录错误并返回原文本
            console.warn('UTF-8编码转换失败:', error);
            return text;
        }
    }
}