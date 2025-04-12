import axios, {AxiosRequestConfig} from 'axios';

/**
 * TOS请求体接口定义
 */
export interface TosRequestData extends Record<string, unknown> {
    type: string;
}

/**
 * TOS响应数据接口定义
 */
export interface TosResponse {
    message: string;
    result: {
        status_code: number;
        request_id: string;
        crc64: number;
    };
}

/**
 * TOS请求工具类，用于向TOS服务发送POST请求
 */
export class TosRequest {
    private readonly apiUrl: string = 'https://hwapi.mizhoubaobei.top/tos';

    /**
     * 发送POST请求到TOS服务
     * @param {TosRequestData} data - 请求体数据
     * @returns {Promise<TosResponse>} 返回服务器响应数据
     * @throws {Error} 可能的错误：
     * - 网络连接失败
     * - API调用超时
     * - 服务器端错误
     * - 无效的JSON格式
     */
    async sendRequest(data: TosRequestData): Promise<TosResponse> {
        try {
            // 验证并确保数据是有效的JSON格式
            const options: AxiosRequestConfig = {
                method: 'POST',
                url: this.apiUrl,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json;charset=UTF-8'
                },
                data: data
            };

            const response = await axios(options);
            return response.data;
        } catch (error) {
            if (error instanceof SyntaxError) {
                throw new Error(`无效的JSON格式: ${error.message}`);
            }
            throw new Error(`TOS请求失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}