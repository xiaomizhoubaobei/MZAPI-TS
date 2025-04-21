import axios, {AxiosRequestConfig} from 'axios';

/**
 * 百度 API 认证成功响应的类型定义
 */
interface BaiduAuthResponse {
    refresh_token: string;
    expires_in: number;
    session_key: string;
    access_token: string;
    scope: string;
    session_secret: string;
}

/**
 * BaiduAuth类用于处理百度API的鉴权 (单例模式)
 *
 * 该类封装了获取百度AI开放平台访问令牌的功能。开发者需要在百度AI开放平台
 * 获取应用的API Key(clientId)和Secret Key(clientSecret)。
 */
class BaiduAuth {
    private static instance: BaiduAuth | null = null;
    private clientId: string;
    private clientSecret: string;
    private readonly tokenUrl: string;
    private accessToken: string | null = null; // 缓存token
    private tokenExpiresAt: number | null = null; // token过期时间

    /**
     * 私有构造函数，防止外部直接实例化
     * @param {string} clientId - 百度API的客户端ID(API Key)
     * @param {string} clientSecret - 百度API的客户端密钥(Secret Key)
     */
    private constructor(clientId: string, clientSecret: string) {
        if (!clientId || !clientSecret) {
            throw new Error('clientId 和 clientSecret 不能为空');
        }
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.tokenUrl = 'https://aip.baidubce.com/oauth/2.0/token';
    }

    /**
     * 获取BaiduAuth的唯一实例
     * @param {string} clientId - 百度API的客户端ID(API Key)
     * @param {string} clientSecret - 百度API的客户端密钥(Secret Key)
     * @returns {BaiduAuth} 返回BaiduAuth的单例
     */
    public static getInstance(clientId: string, clientSecret: string): BaiduAuth {
        if (!BaiduAuth.instance) {
            BaiduAuth.instance = new BaiduAuth(clientId, clientSecret);
        } else if (BaiduAuth.instance.clientId !== clientId || BaiduAuth.instance.clientSecret !== clientSecret) {
            throw new Error('传入的key/secret与已存在的实例不同，请使用updateCredentials方法更新实例');
        }
        return BaiduAuth.instance;
    }

    /**
     * 更新实例的key/secret
     * @param {string} clientId - 新的百度API客户端ID(API Key)
     * @param {string} clientSecret - 新的百度API客户端密钥(Secret Key)
     */
    public static updateCredentials(clientId: string, clientSecret: string): void {
        if (!BaiduAuth.instance) {
            throw new Error('实例不存在，请先使用getInstance方法创建实例');
        }
        if (!clientId || !clientSecret) {
            throw new Error('clientId 和 clientSecret 不能为空');
        }
        BaiduAuth.instance.clientId = clientId;
        BaiduAuth.instance.clientSecret = clientSecret;
        BaiduAuth.instance.accessToken = null;
        BaiduAuth.instance.tokenExpiresAt = null;
    }

    /**
     * 销毁当前实例
     * 调用此方法后，下次getInstance将创建新实例
     */
    public static destroyInstance(): void {
        BaiduAuth.instance = null;
    }

    /**
     * 获取百度API的访问令牌 (带缓存)
     *
     * 该方法通过HTTP POST请求获取访问令牌。如果请求成功，返回访问令牌字符串；
     * 如果请求失败，将抛出包含详细错误信息的Error对象。
     * 如果缓存中有有效token，则直接返回缓存的token。
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
        // 检查缓存的token是否有效 (例如，提前5分钟过期)
        if (this.accessToken && this.tokenExpiresAt && Date.now() < this.tokenExpiresAt - 5 * 60 * 1000) {
            return this.accessToken;
        }

        const options: AxiosRequestConfig = {
            method: 'POST',
            url: `${this.tokenUrl}?client_id=${this.clientId}&client_secret=${this.clientSecret}&grant_type=client_credentials`,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
        try {
            // 使用定义的接口作为响应类型
            const response = await axios<BaiduAuthResponse>(options);
            const {access_token, expires_in} = response.data;
            if (!access_token) {
                throw new Error('未能从响应中获取 access_token');
            }
            this.accessToken = access_token;
            // expires_in 单位是秒，转换为毫秒时间戳
            this.tokenExpiresAt = Date.now() + (expires_in * 1000);
            return access_token; // Directly return the non-null token
        } catch (error: any) {
            // 清除可能无效的缓存
            this.accessToken = null;
            this.tokenExpiresAt = null;
            let errorMessage = `获取百度API鉴权令牌失败: ${error instanceof Error ? error.message : String(error)}`;
            if (error.response && error.response.data) {
                // 处理百度API返回的具体错误信息
                const errorData = error.response.data;
                if (errorData.error === 'invalid_client') {
                    if (errorData.error_description === 'unknown client id') {
                        errorMessage = 'API Key不正确';
                    } else if (errorData.error_description === 'Client authentication failed') {
                        errorMessage = 'Secret Key不正确';
                    }
                } else {
                    errorMessage += ` - ${JSON.stringify(errorData)}`;
                }
            }
            throw new Error(errorMessage);
        }
    }
}

export default BaiduAuth;