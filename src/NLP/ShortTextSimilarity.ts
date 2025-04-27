import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import {TosRequest} from "../utils/tosRequest";
import {initSkyWalking} from "../utils/skywalking";

interface ShortTextSimilarityResponse {
    log_id: number;
    texts: {
        text_1: string;
        text_2: string;
    };
    score: number;
}

/**
 * 短文本相似度比较类
 *
 * 该类封装了百度AI开放平台的短文本相似度比较功能，支持ERNIE等模型。
 * 使用前需要在百度AI开放平台申请API Key和Secret Key。
 */
export class ShortTextSimilarity {
    private readonly apiUrl: string;
    private readonly auth: BaiduAuth;
    private readonly clientId: string;
    private readonly clientSecret: string;

    /**
     * 创建短文本相似度比较实例
     * @param {string} clientId - 百度API的客户端ID(API Key)
     * @param {string} clientSecret - 百度API的客户端密钥(Secret Key)
     */
    constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.auth = BaiduAuth.getInstance(this.clientId, this.clientSecret);
        this.apiUrl = 'https://aip.baidubce.com/rpc/2.0/nlp/v2/simnet';
        initSkyWalking();
    }

    /**
     * 比较两个短文本的相似度
     * @param {string} text1 - 第一个文本，UTF-8编码且不超过512字节
     * @param {string} text2 - 第二个文本，UTF-8编码且不超过512字节
     * @param {string} [model="ERNIE"] - 使用的模型，默认为ERNIE
     * @returns {Promise<ShortTextSimilarityResponse>} 返回相似度比较结果
     * @throws {Error} 可能的错误原因：
     * - 文本长度超过512字节
     * - 网络请求失败
     * - API鉴权失败
     * - 服务器返回错误
     */
    async compare(text1: string, text2: string, model: string = "ERNIE"): Promise<ShortTextSimilarityResponse> {
        if (Buffer.byteLength(text1, 'utf8') > 512 || Buffer.byteLength(text2, 'utf8') > 512) {
            throw new Error('文本长度不能超过512字节');
        }
        try {
            const token: string = await this.auth.getToken();
            const options: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.apiUrl}?charset=UTF-8&access_token=${token}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {text_1: text1, text_2: text2, model}
            };

            const response = await axios<ShortTextSimilarityResponse>(options);
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest({
                ...response.data,
                type: "ShortTextSimilarity"
            });
            return response.data;
        } catch (error) {
            throw new Error(`短文本相似度比较失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}