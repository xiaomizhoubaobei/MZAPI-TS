import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import {Log} from "./Log";

/**
 * 定义与百度文心大模型API交互的消息格式
 *
 * @interface Message
 * @property {('user' | 'assistant')} role - 消息的角色，只能是'user'或'assistant'
 * @property {string} content - 消息的文本内容
 * @example
 * ```typescript
 * const message: Message = {
 *   role: 'user',
 *   content: '你好，请介绍一下你自己'
 * };
 * ```
 */
export interface Message {
    role: 'user' | 'assistant';
    content: string;
}

/**
 * 定义百度文心大模型API的响应数据格式
 *
 * @interface APIResponse
 * @property {string} id - 本次对话的唯一标识符
 * @property {string} object - 模型标识符
 * @property {number} created - 对话创建时间戳
 * @property {string} result - 模型返回的文本结果
 * @property {boolean} is_truncated - 是否被截断
 * @property {boolean} need_clear_history - 是否需要清除历史记录
 * @property {object} usage - Token使用统计
 * @property {number} usage.prompt_tokens - 提示Token数量
 * @property {number} usage.completion_tokens - 补全Token数量
 * @property {number} usage.total_tokens - 总Token数量
 * @example
 * ```typescript
 * const response: APIResponse = {
 *   id: 'as-123456',
 *   object: 'ERNIE-Bot-4',
 *   created: 1699000000,
 *   result: '你好！我是百度文心大模型...',
 *   is_truncated: false,
 *   need_clear_history: false,
 *   usage: {
 *     prompt_tokens: 10,
 *     completion_tokens: 20,
 *     total_tokens: 30
 *   }
 * };
 * ```
 */
export interface APIResponse {
    id: string;
    object: string;
    created: number;
    result: string;
    is_truncated: boolean;
    need_clear_history: boolean;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

/**
 * BaiduERNIEBase类是百度文心大模型API的基类
 *
 * 该类提供了与百度文心大模型API交互的基础功能，包括：
 * - 自动获取和管理访问令牌
 * - 发送对话请求并处理响应
 * - 参数验证和错误处理
 *
 * @abstract
 * @class
 */
abstract class BaiduERNIEBase {
    protected static readonly BASE_URL: string = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/';
    protected readonly apiKey: string;
    protected readonly secretKey: string;
    protected readonly apiUrl: string;

    /**
     * 创建BaiduERNIEBase实例
     * @param {string} apiKey - 百度API的客户端ID，用于身份验证
     * @param {string} secretKey - 百度API的客户端密钥，用于身份验证
     * @param {string} apiUrl - API端点URL
     * @throws {Error} 如果apiKey或secretKey为空或无效，将抛出错误
     */
    protected constructor(apiKey: string, secretKey: string, apiUrl: string) {
        if (!apiKey || !secretKey || !apiUrl) {
            throw new Error('apiKey、secretKey和apiUrl都是必需的');
        }
        this.apiKey = apiKey;
        this.secretKey = secretKey;
        this.apiUrl = apiUrl;
    }

    /**
     * 向百度文心大模型发送请求
     * @param {Message[]} messages - 对话消息数组
     * @param {number} [temperature=0.8] - 采样温度，控制输出的随机性
     * @param {number} [top_p=0.8] - 采样参数，控制输出token的多样性
     * @param {number} [penalty_score=1.0] - 重复惩罚系数
     * @param {number} [max_output_tokens=1024] - 最大输出token数量
     * @param {boolean} [stream=false] - 是否使用流式响应模式，true表示使用流式响应，false表示使用普通响应
     * @returns {Promise<APIResponse>} 返回API的响应数据
     * @throws {Error} 如果参数校验失败或API请求失败，将抛出错误
     */
    /**
     * 向百度文心大模型发送请求
     * @param {Message[]} messages - 对话消息数组
     * @param {number} [temperature=0.8] - 采样温度，控制输出的随机性
     * @param {number} [top_p=0.8] - 采样参数，控制输出token的多样性
     * @param {number} [penalty_score=1.0] - 重复惩罚系数
     * @param {number} [max_output_tokens=1024] - 最大输出token数量
     * @param {boolean} [stream=false] - 是否使用流式响应模式
     * @param {boolean} [enable_system_memory=false] - 是否开启系统记忆功能，开启后需要提供system_memory_id
     * @param {string} [system_memory_id] - 系统记忆ID，当enable_system_memory为true时必须提供，用于标识和恢复对话上下文
     * @returns {Promise<APIResponse>} 返回API的响应数据
     * @throws {Error} 如果参数校验失败或API请求失败，将抛出错误
     */
    async sendRequest(
        messages: Message[],
        temperature: number = 0.8,
        top_p: number = 0.8,
        penalty_score: number = 1.0,
        max_output_tokens: number = 1024,
        stream: boolean = false,
        enable_system_memory: boolean = false,
        system_memory_id?: string
    ): Promise<APIResponse> {
        this.validateMessages(messages);
        this.validateParameters(temperature, top_p, penalty_score, max_output_tokens);

        const accessToken = await this.getAccessToken();
        const options: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.apiUrl}?access_token=${accessToken}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                messages,
                temperature,
                top_p,
                penalty_score,
                max_output_tokens,
                stream,
                enable_system_memory,
                system_memory_id
            })
        };

        try {
            const response = await axios(options);
            Log.sendLog(response.data);
            return response.data;
        } catch (error) {
            throw new Error(`API请求失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * 获取百度API的访问令牌
     * @returns {Promise<string>} 返回访问令牌，有效期为30天
     * @throws {Error} 如果令牌获取失败，将抛出错误
     * @protected
     */
    protected async getAccessToken(): Promise<string> {
        const baiduAuth = new BaiduAuth(this.apiKey, this.secretKey);
        return await baiduAuth.getToken();
    }

    /**
     * 验证消息格式
     * @param {Message[]} messages - 对话消息数组
     * @throws {Error} 如果消息格式无效，将抛出错误
     * @protected
     */
    protected validateMessages(messages: Message[]): void {
        if (!Array.isArray(messages) || messages.length === 0 || messages.length % 2 !== 1) {
            throw new Error('messages参数必须是非空数组且长度为奇数');
        }

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            if (i % 2 === 0 && message.role !== 'user') {
                throw new Error(`第${i + 1}个message的role必须为user`);
            }
            if (i % 2 === 1 && message.role !== 'assistant') {
                throw new Error(`第${i + 1}个message的role必须为assistant`);
            }
        }

        const totalLength = messages.reduce((sum, msg) => sum + (msg.content || '').length, 0);
        if (totalLength > 20000) {
            throw new Error('messages中所有content的总长度不能超过20000个字符');
        }
    }

    /**
     * 发送流式请求并通过回调函数处理响应
     * @param {Message[]} messages - 对话消息数组
     * @param {(chunk: string) => void} callback - 处理每个文本块的回调函数
     * @param {number} [temperature=0.8] - 采样温度
     * @param {number} [top_p=0.8] - 采样参数
     * @param {number} [penalty_score=1.0] - 重复惩罚系数
     * @param {number} [max_output_tokens=1024] - 最大输出token数量
     * @param {boolean} [enable_system_memory=false] - 是否开启系统记忆功能，开启后需要提供system_memory_id
     * @returns {Promise<void>}
     * @throws {Error} 如果参数校验失败或API请求失败，将抛出错误
     */
    async streamRequest(
        messages: Message[],
        callback: (chunk: string) => void,
        temperature: number = 0.8,
        top_p: number = 0.8,
        penalty_score: number = 1.0,
        max_output_tokens: number = 2048,
        enable_system_memory: boolean = false
    ): Promise<void> {
        this.validateMessages(messages);
        this.validateParameters(temperature, top_p, penalty_score, max_output_tokens);

        const accessToken = await this.getAccessToken();
        const options: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.apiUrl}?access_token=${accessToken}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                messages,
                temperature,
                top_p,
                penalty_score,
                max_output_tokens,
                stream: true,
                enable_system_memory
            }),
            responseType: 'stream'
        };

        try {
            const response = await axios(options);
            response.data.on('data', (chunk: Buffer) => {
                const lines = chunk.toString().split('\n');
                for (const line of lines) {
                    if (line.trim() === '') continue;
                    try {
                        // 处理SSE格式数据，去掉'data:'前缀
                        const jsonStr = line.trim().startsWith('data:') ? line.trim().substring(5) : line.trim();
                        const data = JSON.parse(jsonStr);
                        if (data.result) {
                            callback(data.result);
                        }
                    } catch (error) {
                        console.error('解析流式数据失败:', error);
                    }
                }
            });

            await new Promise((resolve, reject) => {
                response.data.on('end', resolve);
                response.data.on('error', reject);
            });
        } catch (error) {
            throw new Error(`流式请求失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**
     * 验证参数范围
     * @param {number} temperature - 采样温度
     * @param {number} top_p - 采样参数
     * @param {number} penalty_score - 重复惩罚系数
     * @param {number} max_output_tokens - 最大输出token数量
     * @throws {Error} 如果参数超出有效范围，将抛出错误
     * @protected
     */
    protected validateParameters(
        temperature: number,
        top_p: number,
        penalty_score: number,
        max_output_tokens: number,
    ): void {
        if (temperature <= 0 || temperature > 1.0) {
            throw new Error('temperature参数必须是数字且取值范围为(0, 1.0]');
        }
        if (top_p < 0 || top_p > 1.0) {
            throw new Error('top_p参数必须是数字且取值范围为[0, 1.0]');
        }
        if (penalty_score < 1.0 || penalty_score > 2.0) {
            throw new Error('penalty_score参数必须是数字且取值范围为[1.0, 2.0]');
        }
        if (max_output_tokens < 2 || max_output_tokens > 2048) {
            throw new Error('max_output_tokens参数必须是数字且取值范围为[2, 2048]');
        }
    }
}

export default BaiduERNIEBase;