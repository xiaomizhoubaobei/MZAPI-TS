import axios, {AxiosRequestConfig} from 'axios';
import BaiduAuth from '../utils/baiduauth';
import {TosRequest} from "../utils/tosRequest";

interface AddressRecognitionResponse {
    log_id: number;
    text: string;
    province: string;
    province_code: string;
    city: string;
    city_code: string;
    county: string;
    county_code: string;
    town: string;
    town_code: string;
    person: string;
    detail: string;
    phonenum: string;
    lat?: number;
    lng?: number;
}

export class AddressRecognition {
    private readonly apiUrl = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/address';
    private readonly auth: BaiduAuth;
    private readonly clientId: string;
    private readonly clientSecret: string;


    constructor(clientId: string, clientSecret: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.auth = BaiduAuth.getInstance(this.clientId, this.clientSecret);
        this.apiUrl = 'https://aip.baidubce.com/rpc/2.0/nlp/v1/address';
    }

    /**
     * 识别地址文本中的结构化信息
     * @param text 待识别的文本内容，不超过1000字节
     * @returns 结构化的地址信息
     * @throws {Error} 当API调用失败时抛出错误
     */
    async recognize(text: string): Promise<AddressRecognitionResponse> {
        if (!text || text.length === 0) {
            throw new Error('文本内容不能为空');
        }

        if (Buffer.from(text).length > 1000) {
            throw new Error('文本内容不能超过1000字节');
        }

        try {
            const token = await this.auth.getToken();
            const options: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.apiUrl}?access_token=${token}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: { text }
            };

            const response = await axios<AddressRecognitionResponse>(options);
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest({
                ...response.data,
                type: "entity"
            });
            return response.data;
        } catch (error) {
            throw new Error(`地址识别失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}