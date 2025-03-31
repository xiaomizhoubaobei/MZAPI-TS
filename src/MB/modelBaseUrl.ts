/**
 * 模型基础URL映射工具
 */

export type ModelType =
// ERNIE 系列
    | 'ernie-4.0-8k'
    | 'ernie-4.0-8k-preview'
    | 'ernie-4.0-8k-latest'
    | 'ernie-4.0-turbo-8k'
    | 'ernie-4.0-turbo-8k-preview'
    | 'ernie-4.0-turbo-8k-latest'
    | 'ernie-4.0-turbo-128k'
    | 'ernie-3.5-8k'
    | 'ernie-3.5-8k-preview'
    | 'ernie-3.5-128k'
    | 'ernie-3.5-128k-preview'

    // Yi 系列
    | 'yi-34b-chat'

    // Gemma 系列
    | 'gemma-7b-it'

    // Mixtral 系列
    | 'mixtral-8x7b-instruct'

    // Speed 系列
    | 'ernie-speed-8k'
    | 'ernie-speed-128k'
    | 'ernie-speed-pro-128k'

    // Lite 系列
    | 'ernie-lite-8k'
    | 'ernie-lite-pro-128k'

    // Character 系列
    | 'ernie-char-8k'
    | 'ernie-char-fiction-8k'
    | 'ernie-char-fiction-8k-preview'

    // 其他系列
    | 'ernie-functions-8k'
    | 'ernie-novel-8k'
    | 'ernie-tiny-8k'

    // 千帆系列
    | 'qianfan-dynamic-8k'
    | 'qianfan-agent-speed-8k'
    | 'qianfan-agent-speed-32k'
    | 'qianfan-agent-lite-8k';

/**
 * 获取模型对应的基础URL
 * @param modelName 模型名称
 * @returns 对应的基础URL
 * @throws 当提供的模型名称无效时抛出错误
 */
export function getModelBaseUrl(modelName: ModelType): string {
    const baseUrlMap: Record<ModelType, string> = {
        // ERNIE 系列
        'ernie-4.0-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro',
        'ernie-4.0-8k-preview': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_4.0_8k_preview',
        'ernie-4.0-8k-latest': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_4.0_8k_latest',
        'ernie-4.0-turbo-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_turbo_pro',
        'ernie-4.0-turbo-8k-preview': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_4.0_turbo_8k_preview',
        'ernie-4.0-turbo-8k-latest': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_4.0_turbo_8k_latest',
        'ernie-4.0-turbo-128k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_4.0_turbo_128k',
        'ernie-3.5-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_3.5',
        'ernie-3.5-8k-preview': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_3.5_preview',
        'ernie-3.5-128k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_3.5_128k',
        'ernie-3.5-128k-preview': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_3.5_128k_preview',
        // Speed 系列
        'ernie-speed-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_speed',
        'ernie-speed-128k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_speed_128k',
        'ernie-speed-pro-128k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_speed_pro_128k',
        // Lite 系列
        'ernie-lite-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_lite',
        'ernie-lite-pro-128k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_lite_pro_128k',
        // Character 系列
        'ernie-char-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-char-8k',
        'ernie-char-fiction-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-char-fiction-8k',
        'ernie-char-fiction-8k-preview': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie-char-fiction-8k-preview',
        // 其他系列
        'ernie-functions-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_functions',
        'ernie-novel-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_novel',
        'ernie-tiny-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_tiny',
        // 千帆系列
        'qianfan-dynamic-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/qianfan-dynamic-8k',
        'qianfan-agent-speed-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/qianfan-agent-speed-8k',
        'qianfan-agent-speed-32k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/qianfan-agent-speed-32k',
        'qianfan-agent-lite-8k': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/qianfan-agent-lite-8k',
        // Yi 系列
        'yi-34b-chat': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/yi_34b_chat',
        // Gemma 系列
        'gemma-7b-it': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/gemma_7b_it',
        // Mixtral 系列
        'mixtral-8x7b-instruct': 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/mixtral_8x7b_instruct'
    };

    const baseUrl = baseUrlMap[modelName];
    if (!baseUrl) {
        throw new Error(`无效的模型名称: ${modelName}`);
    }

    return baseUrl;
}