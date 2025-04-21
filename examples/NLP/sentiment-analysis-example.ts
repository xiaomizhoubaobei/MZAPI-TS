// 注意: 开发时引用的是SDK内部路径'../src'，实际使用时请修改为SDK包名'mzapi'
import { SentimentAnalysis } from '../../src/NLP/SentimentAnalysis';

// 替换为你的百度API客户端ID和密钥
const clientId = '*****gG8eu';
const clientSecret = '*****kJ7gD';

async function main() {
    try {
        const analyzer = new SentimentAnalysis(clientId, clientSecret);
        
        // 示例文本
        const text = '这家餐厅的食物非常美味，服务也很周到！';
        
        console.log('正在分析文本:', text);
        const result = await analyzer.analyze(text);
        console.log(result)
        console.log('详细分析结果:');
        console.log('情感极性:', result.items[0].sentiment === 0 ? '负向' : result.items[0].sentiment === 1 ? '中性' : '正向');
        console.log('置信度:', result.items[0].confidence);
        console.log('积极概率:', result.items[0].positive_prob);
        console.log('消极概率:', result.items[0].negative_prob);
        
        
    } catch (error) {
        console.error('发生错误:', error instanceof Error ? error.message : String(error));
    }
}

main();