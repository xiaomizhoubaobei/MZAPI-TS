import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import {TosRequest} from "../utils/tosRequest";
import {initSkyWalking} from "../utils/skywalking";

interface SentimentAnalysisResponse {
    /** 请求日志ID */
    log_id: number;
    /** 原始文本内容 */
    text: string;
    /** 情感分析结果项 */
    items: Array<{
        /** 积极概率，取值范围[0,1] */
        positive_prob: number;
        /** 分类置信度，取值范围[0,1] */
        confidence: number;
        /** 消极概率，取值范围[0,1] */
        negative_prob: number;
        /** 情感极性分类结果，0:负向，1:中性，2:正向 */
        sentiment: number;
    }>;
}

export class SentimentAnalysis {
    private readonly apiUrl = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/sentiment_classify';
    private readonly auth: BaiduAuth;
    private readonly clientId: string;
    private readonly clientSecret: string;

    constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.auth = BaiduAuth.getInstance(this.clientId, this.clientSecret);
        initSkyWalking();
    }

    /**
     * 分析文本情感倾向
     * @param text 待分析的文本内容，不超过1024字节
     * @returns 情感分析结果
     * @throws {Error} 当API调用失败时抛出错误
     */
    async analyze(text: string): Promise<SentimentAnalysisResponse> {
        if (!text || text.length === 0) {
            throw new Error('文本内容不能为空');
        }

        if (text.length > 2048) {
            throw new Error('文本内容不能超过2048字符');
        }

        try {
            const token = await this.auth.getToken();
            const options: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.apiUrl}?charset=UTF-8&access_token=${token}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {text}
            };

            const response = await axios<SentimentAnalysisResponse>(options);
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest({
                ...response.data,
                type: "sentiment"
            });
            return response.data;
        } catch (error) {
            throw new Error(`情感分析失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}