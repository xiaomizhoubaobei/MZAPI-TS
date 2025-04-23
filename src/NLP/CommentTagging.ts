import BaiduAuth from '../utils/baiduauth';
import {TosRequest} from "../utils/tosRequest";
import axios, {AxiosRequestConfig} from 'axios';
import {initSkyWalking} from "../utils/skywalking";

export interface CommentTaggingResponse {
    log_id: number;
    items: {
        prop: string;
        adj: string;
        sentiment: number;
        begin_pos: number;
        end_pos: number;
        abstract: string;
    }[];
}

export class CommentTagging {
    private readonly apiUrl = 'https://aip.baidubce.com/rpc/2.0/nlp/v2/comment_tag';
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
     * 提取评论句子的关注点和评论观点
     * @param text 评论内容，最大10240字节
     * @param type 评论行业类型，默认为4（餐饮美食），可选值：
     *   1: 酒店 - 例:『酒店设备齐全、干净卫生』->『酒店设备齐全』、『干净卫生』
     *   2: KTV - 例:『环境一般般把，音响设备也一般，隔音太差』->『环境一般』、『音响设备一般』、『隔音差』
     *   3: 丽人 - 例:『手法专业，重要的是效果很棒』->『手法专业』、『效果不错』
     *   4: 美食餐饮 - 例:『但是味道太好啦，舍不得剩下』->『味道不错』
     *   5: 旅游 - 例:『景区交通方便，是不错的旅游景点』->『交通方便』、『旅游景点不错』
     *   6: 健康 - 例:『环境很棒，技师服务热情』->『环境不错』、『服务热情』
     *   7: 教育 - 例:『教学质量不错，老师很有经验』->『教学质量不错』、『老师有经验』
     *   8: 商业 - 例:『该公司服务好，收费低，效率高』->『服务好』、『收费低』、『效率高』
     *   9: 房产 - 例:『该房周围设施齐全、出行十分方便』->『设施齐全』、『出行方便』
     *   10: 汽车 - 例:『路宝的优点就是安全性能高、空间大』->『安全性能高』、『空间大』
     *   11: 生活 - 例:『速度挺快、服务态度也不错』->『速度快』、『服务好』
     *   12: 购物 - 例:『他家的东西还是挺贵的』->『消费贵』
     *   13: 3C - 例:『手机待机时间长』->『待机时间长』
     * @returns 评论观点标签及评论观点极性
     * @throws {Error} 当API调用失败时抛出错误
     */
    async tag(text: string, type = 4): Promise<CommentTaggingResponse> {
        if (!text || text.length === 0) {
            throw new Error('评论内容不能为空');
        }

        if (Buffer.from(text).length > 10240) {
            throw new Error('评论内容不能超过10240字节');
        }

        if (type < 1 || type > 13) {
            throw new Error('行业类型必须为1-13之间的整数');
        }

        try {
            const token = await this.auth.getToken();
            const options: AxiosRequestConfig = {
                method: 'POST',
                url: `${this.apiUrl}?charset=UTF-8&access_token=${token}`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {text, type}
            };

            const response = await axios<CommentTaggingResponse>(options);
            const tosRequest = new TosRequest();
            await tosRequest.sendRequest({
                ...response.data,
                type: "comment"
            });
            return response.data;
        } catch (error) {
            throw new Error(`评论观点抽取失败: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
}