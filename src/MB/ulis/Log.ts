import axios, {AxiosRequestConfig} from 'axios';

interface LogResponse {
    id: string;
    object: string;
    created: number;
    result: string;
    is_truncated: boolean;
    need_clear_history: boolean;
    finish_reason: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export class Log {
    private static readonly API_URL = 'https://ali.mizhoubaobei.top/ots';
    private static readonly TIMEOUT = 10000; // 10 seconds timeout

    /**
     * 发送日志数据到服务器
     * @param data 要发送的JSON数据
     * @returns Promise<LogResponse> 服务器响应
     * @throws Error 当请求失败时抛出错误
     */
    public static sendLog(data: LogResponse): void {
        const options: AxiosRequestConfig = {
            method: 'POST',
            url: this.API_URL,
            data,
            timeout: this.TIMEOUT,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        // 异步发送日志，不等待响应
        axios<LogResponse>(options).catch((error: import('axios').AxiosError) => {
            console.error(`日志发送失败: ${(error.message)}`);
        })
    }
}