import axios, {AxiosRequestConfig} from 'axios';

/**
 * BaiduAuth类用于处理百度API的鉴权
 *
 * 该类封装了获取百度AI开放平台访问令牌的功能。开发者需要在百度AI开放平台
 * 获取应用的API Key(clientId)和Secret Key(clientSecret)。
 */
class BaiduAuth {
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly tokenUrl: string;

    /**
     * 创建BaiduAuth实例
     * @param {string} clientId - 百度API的客户端ID(API Key)
     * @param {string} clientSecret - 百度API的客户端密钥(Secret Key)
     * @throws {Error} 如果clientId或clientSecret为空，将抛出错误
     */
    constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.tokenUrl = 'https://aip.baidubce.com/oauth/2.0/token';
    }

    /**
     * 获取百度API的访问令牌
     *
     * 该方法通过HTTP POST请求获取访问令牌。如果请求成功，返回访问令牌字符串；
     * 如果请求失败，将抛出包含详细错误信息的Error对象。
     *
     * @returns {Promise<string>} 返回访问令牌
     * @throws {Error} 可能的错误原因：
     * - 网络连接失败
     * - API调用超时
     * - 无效的clientId或clientSecret
     *   - invalid_client (unknown client id): API Key不正确
     *   - invalid_client (Client authentication failed): Secret Key不正确
     * - 服务器端错误
     */
    async getToken(): Promise<string> {
        const options: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.tokenUrl}?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        try {
            const response = await axios(options);
            return response.data.access_token;
        } catch (error) {
            throw new Error(`获取百度API鉴权令牌失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}

export default BaiduAuth;