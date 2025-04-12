import axios, {AxiosRequestConfig} from 'axios';
import {TosRequest} from '../utils/tosRequest';
import BaiduAuth from "../utils/baiduauth";

export interface EntityResponse {
    text: string;
    entity_analysis: EntityItem[];
    log_id: number;
}

export interface EntityItem {
    category?: {
        level_1: string;
        level_2: string;
        level_3: string;
    };
    confidence?: string;
    desc?: string;
    status?: string;
}

export interface RequestParams {
    text: string;
    mention?: string;
}

export class EntityAnalyzer {
    private readonly auth: BaiduAuth;
    private readonly apiUrl: string = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/entity_analysis';

    constructor(apiKey: string, secretKey: string) {
        this.auth = new BaiduAuth(apiKey, secretKey);
    }

    async analyze(text: string, mention?: string): Promise<EntityResponse> {
        if (!text) {
            throw new Error('文本内容不能为空');
        }

        // 验证文本长度（最多128个汉字）
        const chineseCharCount = this.countChineseChars(text);
        if (chineseCharCount > 128) {
            throw new Error(`文本超过长度限制：${chineseCharCount} 个汉字（最大允许128个汉字）`);
        }

        try {
            const token = await this.auth.getToken();

            const options: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.apiUrl}?access_token=${token}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                data: {
                    text,
                    mention
                } as RequestParams
            };

            const response = await axios<EntityResponse>(options);
            const data = response.data;
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest({
                ...response.data,
                type: "entity"
            });

            return data
        } catch (error) {
            throw new Error(`实体分析失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    private countChineseChars(text: string): number {
        // 统计中文字符数量
        const chineseRegex = /[\u4e00-\u9fa5]/g;
        const matches = text.match(chineseRegex);
        return matches ? matches.length : 0;
    }
}