// 注意: 开发时引用的是SDK内部路径'../src'，实际使用时请修改为SDK包名'mzapi'
import { EntityAnalysis } from '../src/NLP/EntityAnalysis';

async function main() {
    // 替换为实际的clientId和clientSecret
    const clientId = '*****gG8eu';
    const clientSecret = '*****kJ7gD';
    
    // 初始化EntityAnalysis实例
    const entityAnalysis = new EntityAnalysis(clientId, clientSecret);
    
    try {
        // 基本调用示例
        console.log('基本调用示例:');
        const result = await entityAnalysis.recognize('百度是一家高科技公司');
        console.log(result);
    } catch (error) {
        console.error('发生错误:', error);
    }
}

main();