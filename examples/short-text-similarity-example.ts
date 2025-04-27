// 注意: 开发时引用的是SDK内部路径'../src'，实际使用时请修改为SDK包名'mzapi'
import { ShortTextSimilarity } from '../src/NLP/ShortTextSimilarity';

// 替换为你的百度API客户端ID和密钥
const CLIENT_ID = 'bsdK1sS6WitJpiSLqgrgG8eu';
const CLIENT_SECRET = 'NsEgyu5MLYuNPZOoL9qORlzyzUCkJ7gD';

async function main() {
    const similarity = new ShortTextSimilarity(CLIENT_ID, CLIENT_SECRET);
    
    try {
        
        // 示例
        const result = await similarity.compare(
            '我喜欢编程', 
            '编程很有趣'
        );
        console.log('相似度得分:', result.score);
        
    } catch (error) {
        console.error('发生错误:', error instanceof Error ? error.message : String(error));
    }
}

main().catch(console.error);