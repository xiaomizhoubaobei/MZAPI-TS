import BaiduERNIEBase, {APIResponse, Message} from '../ulis/base';

/**
 * Ernie4_8K_Turbo_8k_Latest类用于与百度文心大模型ERNIE-4.0-Turbo-8K-Preview进行交互
 *
 * 该类继承自BaiduERNIEBase，提供了与百度文心大模型ERNIE-4.0-Turbo-8K-Preview版本API交互的功能。
 * 主要功能包括：
 * - 自动获取和管理访问令牌
 * - 发送对话请求并处理响应
 * - 参数验证和错误处理
 * - 支持自定义温度、采样参数等高级设置
 * - 支持长文本输入和输出（最大支持8K tokens）
 *
 * @example
 * ```typescript
 * // 创建实例
 * const ernie = new Ernie4_8K_Turbo_8k_Latest('your_api_key', 'your_secret_key');
 *
 * // 基本对话示例
 * const messages: Message[] = [
 *   { role: 'user', content: '你好，请介绍一下你自己' }
 * ];
 * const response = await ernie.sendRequest(messages);
 * console.log(response.result);
 *
 * // 使用自定义参数的对话示例
 * const customMessages: Message[] = [
 *   { role: 'user', content: '请写一篇关于人工智能的文章' }
 * ];
 * const customResponse = await ernie.sendRequest(
 *   customMessages,
 *   0.7,  // 较低的temperature使输出更加确定性
 *   0.9,  // 较高的top_p使输出更加多样
 *   1.2,  // 适中的重复惩罚
 *   2048  // 较大的输出长度限制
 * );
 * ```
 */
export class Ernie4_8K_Turbo_8k_Latest extends BaiduERNIEBase {
    /**
     * 创建Ernie4_8K_Turbo_8k_Latest实例
     *
     * @param {string} apiKey - 百度API的客户端ID，用于身份验证
     * @param {string} secretKey - 百度API的客户端密钥，用于身份验证
     * @throws {Error} 如果apiKey或secretKey为空或无效，将抛出错误
     *
     * @example
     * ```typescript
     * // 基本实例化
     * const ernie = new Ernie4_8K_Turbo_8k_Latest('your_api_key', 'your_secret_key');
     *
     * // 错误处理示例
     * try {
     *   const ernie = new Ernie4_8K_Turbo_8k_Latest('', ''); // 将抛出错误
     * } catch (error) {
     *   console.error('初始化失败:', error. Message);
     * }
     * ```
     */
    constructor(apiKey: string, secretKey: string) {
        const apiUrl = BaiduERNIEBase.BASE_URL + 'ernie-4.0-turbo-8k-latest';
        super(apiKey, secretKey, apiUrl);
    }

    /**
     * 向百度文心大模型4.0-8K发送对话请求
     *
     * @param {Message[]} messages - 对话消息数组，每条消息必须包含role和content字段
     * @param {number} [temperature=0.8] - 采样温度，控制输出的随机性
     *                                    - 取值范围(0, 1.0]，越大表示回复越随机
     *                                    - 建议：创意写作设置较高，事实性回答设置较低
     * @param {number} [top_p=0.8] - 采样参数，控制输出token的多样性
     *                               - 取值范围[0, 1.0]，越大表示选取的候选token越多
     *                               - 建议：需要丰富表达时设置较高，需要准确性时设置较低
     * @param {number} [penalty_score=1.0] - 重复惩罚系数
     *                                      - 取值范围[1.0, 2.0]，越大表示越避免重复内容
     *                                      - 建议：生成长文本时适当提高以避免重复
     * @param {number} [max_output_tokens=1024] - 最大输出token数量
     *                                           - 取值范围[2, 2048]
     *                                           - 建议：根据需要的回复长度适当调整
     * @param {boolean} [stream=false] - 是否使用流式输出
     *                                  - 设置为true时启用流式输出，适用于需要实时显示生成内容的场景
     *                                  - 设置为false时使用普通输出，等待完整响应后一次性返回
     * @returns {Promise<APIResponse>} 返回API的响应数据，包含生成的文本和相关信息
     * @throws {Error} 如果参数校验失败或API请求失败，将抛出错误
     *
     * @example
     * ```typescript
     * // 基本对话示例
     * const messages: Message[] = [
     *   { role: 'user', content: '请介绍一下量子计算' }
     * ];
     * try {
     *   const response = await ernie.sendRequest(messages);
     *   console.log('AI回复:', response.result);
     * } catch (error) {
     *   console.error('请求失败:', error.message);
     * }
     *
     * // 多轮对话示例
     * const conversationMessages: Message[] = [
     *   { role: 'user', content: '我想学习人工智能' },
     *   { role: 'assistant', content: '这是个很好的选择！从哪个方面开始学习呢？' },
     *   { role: 'user', content: '我想从机器学习开始' }
     * ];
     * const response = await ernie.sendRequest(
     *   conversationMessages,
     *   0.7,    // 降低随机性
     *   0.8,    // 保持适中的多样性
     *   1.1,    // 轻微避免重复
     *   2048    // 允许较长回复
     * );
     * ```
     */
    async sendRequest(
        messages: Message[],
        temperature: number = 0.8,
        top_p: number = 0.8,
        penalty_score: number = 1.0,
        max_output_tokens: number = 1024,
        stream: boolean = false
    ): Promise<APIResponse> {
        return super.sendRequest(messages, temperature, top_p, penalty_score, max_output_tokens, stream);
    }

    /**
     * 向百度文心大模型4.0-8K发送流式对话请求
     *
     * @param {Message[]} messages - 对话消息数组，每条消息必须包含role和content字段
     * @param {(chunk: string) => void} callback - 处理每个文本块的回调函数
     * @param {number} [temperature=0.8] - 采样温度，控制输出的随机性
     *                                    - 取值范围(0, 1.0]，越大表示回复越随机
     *                                    - 建议：创意写作设置较高，事实性回答设置较低
     * @param {number} [top_p=0.8] - 采样参数，控制输出token的多样性
     *                               - 取值范围[0, 1.0]，越大表示选取的候选token越多
     *                               - 建议：需要丰富表达时设置较高，需要准确性时设置较低
     * @param {number} [penalty_score=1.0] - 重复惩罚系数
     *                                      - 取值范围[1.0, 2.0]，越大表示越避免重复内容
     *                                      - 建议：生成长文本时适当提高以避免重复
     * @param {number} [max_output_tokens=1024] - 最大输出token数量
     *                                           - 取值范围[2, 2048]
     *                                           - 建议：根据需要的回复长度适当调整
     * @returns {Promise<void>}
     * @throws {Error} 如果参数校验失败或API请求失败，将抛出错误
     *
     * @example
     * ```typescript
     * // 基本流式对话示例
     * const messages: Message[] = [
     *   { role: 'user', content: '请写一篇关于人工智能的长文章' }
     * ];
     * try {
     *   await ernie.streamRequest(
     *     messages,
     *     (chunk) => {
     *       process.stdout.write(chunk); // 实时打印每个文本块
     *     },
     *     0.7,    // 降低随机性
     *     0.8,    // 保持适中的多样性
     *     1.1,    // 轻微避免重复
     *     2048    // 允许较长回复
     *   );
     * } catch (error) {
     *   console.error('流式请求失败:', error.message);
     * }
     * ```
     */
    async streamRequest(
        messages: Message[],
        callback: (chunk: string) => void,
        temperature: number = 0.8,
        top_p: number = 0.8,
        penalty_score: number = 1.0,
        max_output_tokens: number = 1024
    ): Promise<void> {
        return super.streamRequest(messages, callback, temperature, top_p, penalty_score, max_output_tokens);
    }
}