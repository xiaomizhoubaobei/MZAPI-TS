import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import {TosRequest} from "../utils/tosRequest";
import {initSkyWalking} from "../utils/skywalking";

interface EmotionRecognitionResponse {
    /** 请求唯一标识码 */
    log_id: number;
    /** 输入的对话文本内容 */
    text: string;
    /** 分析结果数组 */
    items: Array<{
        /** 情绪一级分类标签 */
        label: 'pessimistic' | 'neutral' | 'optimistic';
        /** 情绪一级分类标签对应的概率 */
        prob: number;
        /** 二级分析结果数组 */
        subitems?: Array<{
            /** 情绪二级分类标签 */
            label: 'thankful' | 'happy' | 'complaining' | 'angry' | 'like' | 'disgusting' | 'fearful' | 'sad';
            /** 情绪二级分类标签对应的概率 */
            prob: number;
            /** 参考回复话术 */
            replies?: string[];
        }>;
    }>;
}

export class EmotionRecognition {
    private readonly apiUrl: string;
    private readonly auth: BaiduAuth;
    private readonly clientId: string;
    private readonly clientSecret: string;


    constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.auth = BaiduAuth.getInstance(this.clientId, this.clientSecret);
        this.apiUrl = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/emotion';
        initSkyWalking();
    }

    async recognize(text: string, scene: string = 'default'): Promise<EmotionRecognitionResponse> {
        if (!text || text.length === 0) {
            throw new Error('文本内容不能为空');
        }
        if (new TextEncoder().encode(text).length > 512) {
            throw new Error('文本长度不能超过512字节');
        }
        const validScenes: string[] = ['default', 'talk', 'task', 'customer_service'];
        if (!validScenes.includes(scene)) {
            throw new Error(`无效的scene参数值: ${scene}, 必须是以下值之一: ${validScenes.join(', ')}`);
        }
        try {
            const token: string = await this.auth.getToken();
            const options: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.apiUrl}?access_token=${token}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {text, scene}
            };

            const response = await axios<EmotionRecognitionResponse>(options);
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest({
                ...response.data,
                type: "EmotionRecognition"
            });
            return response.data;
        } catch (error) {
            throw new Error(`对话情绪识别失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}