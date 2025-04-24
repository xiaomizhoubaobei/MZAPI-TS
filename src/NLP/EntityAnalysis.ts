import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import {TosRequest} from "../utils/tosRequest";
import {initSkyWalking} from "../utils/skywalking";

interface EntityAnalysisResponse {
    log_id: number;
    text: string;
    entity_analysis: Array<{
        mention: string;
        category: {
            level_1: string;
            level_2: string;
            level_3: string;
        };
        confidence: string;
        desc: string;
        status: 'LINKED' | 'NIL';
    }>;
}

export class EntityAnalysis {
    private readonly apiUrl: string;
    private readonly auth: BaiduAuth;
    private readonly clientId: string;
    private readonly clientSecret: string;


    constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.auth = BaiduAuth.getInstance(this.clientId, this.clientSecret);
        this.apiUrl = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/entity_analysis';
        initSkyWalking();
    }

    async recognize(text: string, mention?: string): Promise<EntityAnalysisResponse> {
        try {
            const token: string = await this.auth.getToken();
            const options: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.apiUrl}?access_token=${token}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: mention ? {text, mention} : {text}
            };

            const response = await axios<EntityAnalysisResponse>(options);
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest({
                ...response.data,
                type: "EntityAnalysis"
            });
            return response.data;
        } catch (error) {
            throw new Error(`实体分析失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}