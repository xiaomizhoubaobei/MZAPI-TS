import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import {TosRequest} from "../utils/tosRequest";
import {initSkyWalking} from "../utils/skywalking";

export interface LexerAnalysisResponse {
    text: string;
    items: Array<{
        item: string;
        ne: string;
        pos: string;
        byte_offset: number;
        byte_length: number;
        uri?: string;
        formal?: string;
        basic_words: string[];
        loc_details?: Array<{
            type: string;
            byte_offset: number;
            byte_length: number;
        }>;
    }>;
}

export class LexerAnalysis {
    private readonly apiUrl = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/lexer';
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
     * 对文本进行词法分析（分词、词性标注、专名识别）
     * @param text 待分析的文本内容，不超过20000字节
     * @param charset 文本编码格式，支持GBK或UTF-8
     * @returns 词法分析结果
     * @throws {Error} 当API调用失败时抛出错误
     */
    async analyze(text: string, charset: 'GBK' | 'UTF-8' = 'UTF-8'): Promise<LexerAnalysisResponse> {
        if (!text || text.length === 0) {
            throw new Error('文本内容不能为空');
        }

        if (Buffer.from(text).length > 20000) {
            throw new Error('文本内容不能超过20000字节');
        }

        try {
            const token = await this.auth.getToken();
            const url = charset === 'UTF-8'
                ? `${this.apiUrl}?charset=UTF-8&access_token=${token}`
                : `${this.apiUrl}?access_token=${token}`;

            const options: AxiosRequestConfig = {
                method: 'POST',
                url,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {text}
            };

            const response = await axios<LexerAnalysisResponse>(options);
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest({
                ...response.data,
                type: "lexer"
            });
            return response.data;
        } catch (error) {
            throw new Error(`词法分析失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}