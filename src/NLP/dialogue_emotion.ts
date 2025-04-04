import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import {TosRequest} from "../utils/tosRequest";

/**
 * 对话情绪识别结果接口
 */
/**
 * 二级情绪分类结果接口
 */
interface DialogueEmotionSubItem {
    /**
     * 情绪二级分类标签
     * 客服模型：
     * - thankful: 感谢
     * - happy: 愉快
     * - complaining: 抱怨
     * - angry: 愤怒
     * 闲聊模型：
     * - like: 喜爱
     * - happy: 愉快
     * - angry: 愤怒
     * - disgusting: 厌恶
     * - fearful: 恐惧
     * - sad: 悲伤
     */
    label: string;
    /**
     * 情绪二级分类标签对应的概率
     */
    prob: number;
    /**
     * 参考回复话术，中性情绪下该项为空
     */
    replies?: string[];
}

interface DialogueEmotionItem {
    /**
     * 情绪一级分类标签
     * - pessimistic: 负向情绪
     * - neutral: 中性情绪
     * - optimistic: 正向情绪
     */
    label: string;
    /**
     * 情绪一级分类标签对应的概率
     */
    prob: number;
    /**
     * 二级分析结果数组
     */
    subitems?: DialogueEmotionSubItem[];
}

interface DialogueEmotionResponse {
    /**
     * 输入的对话文本内容
     */
    text: string;
    /**
     * 对话情绪识别结果数组
     */
    items: DialogueEmotionItem[];
    /**
     * 日志ID
     */
    log_id: number;
}

/**
 * 对话场景类型
 */
type DialogueScene = 'default' | 'talk' | 'task' | 'customer_service';

/**
 * 对话情绪识别类，用于分析对话文本的情绪
 */
export class DialogueEmotionAnalyzer {
    private readonly auth: BaiduAuth;
    private readonly apiUrl: string = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/emotion?charset=UTF-8';

    /**
     * 创建对话情绪识别实例
     * @param {string} apiKey - 百度API的客户端ID
     * @param {string} secretKey - 百度API的客户端密钥
     * @throws {Error} 如果apiKey或secretKey为空，将抛出错误
     */
    constructor(apiKey: string, secretKey: string) {
        this.auth = new BaiduAuth(apiKey, secretKey);
    }

    /**
     * 分析对话文本的情绪
     * @param {string} text - 待分析的对话文本内容
     * @param {DialogueScene} [scene='default'] - 对话场景，可选值：
     *   - default: 默认项-不区分场景
     *   - talk: 闲聊对话-如度秘聊天等
     *   - task: 任务型对话-如导航对话等
     *   - customer_service: 客服对话-如电信/银行客服等
     * @returns {Promise<DialogueEmotionResponse>} 返回对话情绪识别结果
     * @throws {Error} 可能的错误：
     * - 文本为空
     * - 文本长度超过限制
     * - 网络连接失败
     * - API调用超时
     * - 无效的访问令牌
     * - 服务器端错误
     */
    async analyze(text: string, scene: DialogueScene = 'default'): Promise<DialogueEmotionResponse> {
        if (!text) {
            throw new Error('对话文本内容不能为空');
        }

        // 检测文本编码并在需要时进行转换
        const encoding = this.detectEncoding(text);
        if (encoding !== 'UTF-8') {
            text = this.convertToUTF8(text);
        }

        // 验证文本长度（最大支持512字节）
        const byteLength = this.getByteLength(text);
        if (byteLength > 512) {
            throw new Error(`文本超过长度限制：${byteLength} 字节（最大允许512字节）`);
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
                    scene: scene
                }
            };

            const response = await axios(options);
            const data = response.data;
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest(response.data);

            // 转换为标准返回格式
            return {
                text: text,
                items: data.items.map((item: DialogueEmotionItem) => ({
                    label: item.label,
                    prob: item.prob,
                    subitems: item.subitems?.map((subitem: DialogueEmotionSubItem) => ({
                        label: subitem.label,
                        prob: subitem.prob,
                        replies: subitem.replies
                    }))
                })),
                log_id: data.log_id
            };
        } catch (error) {
            throw new Error(`对话情绪识别失败: ${error instanceof Error ? error.message : String(error)}`);
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
        // 检查是否为有效的UTF-8编码
        try {
            const encoder = new TextEncoder();
            const decoder = new TextDecoder('utf-8', {fatal: true});
            const encoded = encoder.encode(text);
            decoder.decode(encoded);
            return 'UTF-8';
        } catch (e) {
            // 如果解码失败，可能是其他编码
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
        } catch (e) {
            // 如果转换失败，返回原文本
            return text;
        }
    }
}