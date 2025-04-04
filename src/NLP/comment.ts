import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import {TosRequest} from "../utils/tosRequest";

/**
 * 评论观点抽取结果项接口
 */
interface CommentItem {
    /**
     * 评论观点
     */
    prop: string;
    /**
     * 观点对应的情感倾向
     * 0：负向
     * 1：中性
     * 2：正向
     */
    sentiment: number;
    /**
     * 观点的起始位置
     */
    begin_pos: number;
    /**
     * 观点的结束位置
     */
    end_pos: number;
    /**
     * 观点对应的情感词
     */
    adj: string;
    /**
     * 对应于该情感搭配的短句摘要
     */
    abstract: string;
}

interface CommentResponse {
    /**
     * 输入的文本内容
     */
    text: string;
    /**
     * 评论观点抽取结果数组
     */
    items: CommentItem[];
    /**
     * 日志ID
     */
    log_id: number;
}

/**
 * 评论观点抽取类，用于从评论中抽取观点
 */
export class CommentAnalyzer {
    private readonly auth: BaiduAuth;
    private readonly apiUrl: string = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/comment_tag?charset=UTF-8';

    /**
     * 创建评论观点抽取实例
     * @param {string} apiKey - 百度API的客户端ID
     * @param {string} secretKey - 百度API的客户端密钥
     * @throws {Error} 如果apiKey或secretKey为空，将抛出错误
     */
    constructor(apiKey: string, secretKey: string) {
        this.auth = new BaiduAuth(apiKey, secretKey);
    }

    async analyze(text: string, type: number = 4): Promise<CommentResponse> {
        if (!text) {
            throw new Error('文本内容不能为空');
        }

        if (type < 1 || type > 13) {
            throw new Error('type参数必须在1-13范围内');
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
                    text: text,
                    type: type
                }
            };

            const response = await axios(options);
            const data = response.data;
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest(response);

            return {
                text: text,
                items: data.items || [],
                log_id: data.log_id
            };
        } catch (error) {
            throw new Error(`评论观点抽取失败: ${error instanceof Error ? error.message : String(error)}`);
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
     * 检测文本编码
     * @param {string} text - 待检测的文本
     * @returns {string} 返回检测到的编码格式
     * @private
     */
    private detectEncoding(text: string): string {
        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder('utf-8', {fatal: true});
            const encoded = encoder.encode(text);
            decoder.decode(encoded);
            return 'UTF-8';
        } catch (e) {
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
            const encoder = new TextEncoder();
            const decoder = new TextDecoder('utf-8', {fatal: false});
            const encoded = encoder.encode(text);
            return decoder.decode(encoded);
        } catch (e) {
            return text;
        }
    }
}