import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import {TosRequest} from "../utils/tosRequest";

/**
 * 词法分析结果项接口
 *
 * @remarks
 * 词性标注缩略说明：
 * - n: 普通名词
 * - f: 方位名词
 * - s: 处所名词
 * - t: 时间名词
 * - nr: 人名
 * - ns: 地名
 * - nt: 机构团体名
 * - nw: 作品名
 * - nz: 其他专名
 * - v: 普通动词
 * - vd: 动副词
 * - vn: 名动词
 * - a: 形容词
 * - ad: 副形词
 * - an: 名形词
 * - d: 副词
 * - m: 数量词
 * - q: 量词
 * - r: 代词
 * - p: 介词
 * - c: 连词
 * - u: 助词
 * - xc: 其他虚词
 * - w: 标点符号
 *
 * 专名识别缩略说明：
 * - PER: 人名
 * - LOC: 地名
 * - ORG: 机构名
 * - TIME: 时间
 */

/**
 * 地址成分接口
 */
interface LocationDetail {
    /**
     * 成分类型，如省、市、区、县
     */
    type: string;
    /**
     * 在item中的字节级offset
     */
    byte_offset: number;
    /**
     * 字节级length
     */
    byte_length: number;
}

/**
 * 词法分析结果项接口
 */
interface LexerItem {
    /**
     * 词汇的字符串
     */
    item: string;
    /**
     * 词性，词性标注算法使用。命名实体识别算法中，此项为空串
     */
    pos: string;
    /**
     * 命名实体类型，命名实体识别算法使用。词性标注算法中，此项为空串
     */
    ne: string;
    /**
     * 在text中的字节级offset
     */
    byte_offset: number;
    /**
     * 字节级length
     */
    byte_length: number;
    /**
     * 链指到知识库的URI，只对命名实体有效。对于非命名实体和链接不到知识库的命名实体，此项为空串
     */
    uri: string;
    /**
     * 词汇的标准化表达，主要针对时间、数字单位，没有归一化表达的，此项为空串
     */
    formal: string;
    /**
     * 基本词成分
     */
    basic_words: string[];
    /**
     * 地址成分，非必需，仅对地址型命名实体有效，没有地址成分的，此项为空数组
     */
    loc_details: LocationDetail[];
}

interface LexerResponse {
    /**
     * 日志ID
     */
    log_id: number;
    /**
     * 词法分析结果数组
     */
    items: LexerItem[];
}

/**
 * 词法分析类，用于进行中文分词、词性标注和专名识别
 */
export class LexerAnalyzer {
    private readonly auth: BaiduAuth;
    private readonly apiUrl: string = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/lexer?charset=UTF-8';

    /**
     * 创建词法分析实例
     * @param {string} apiKey - 百度API的客户端ID
     * @param {string} secretKey - 百度API的客户端密钥
     * @throws {Error} 如果apiKey或secretKey为空，将抛出错误
     */
    constructor(apiKey: string, secretKey: string) {
        this.auth = new BaiduAuth(apiKey, secretKey);
    }

    /**
     * 对文本进行词法分析
     * @param {string} text - 待分析的文本内容
     * @returns {Promise<LexerResponse>} 返回词法分析结果
     * @throws {Error} 如果文本为空或分析失败，将抛出错误
     */
    async analyze(text: string): Promise<LexerResponse> {
        if (!text) {
            throw new Error('文本内容不能为空');
        }

        // 检测文本编码并在需要时进行转换
        const encoding = this.detectEncoding(text);
        if (encoding !== 'UTF-8') {
            text = this.convertToUTF8(text);
        }

        // 验证文本长度（最大支持20000字节）
        const byteLength = this.getByteLength(text);
        if (byteLength > 20000) {
            throw new Error(`文本超过长度限制：${byteLength} 字节（最大允许20000字节）`);
        }

        try {
            const token = await this.auth.getToken();

            const options: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.apiUrl}?charset=UTF-8&access_token=${token}`,
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

            return data;
        } catch (error) {
            throw new Error(`词法分析失败: ${error instanceof Error ? error.message : String(error)}`);
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