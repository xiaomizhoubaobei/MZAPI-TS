// 注意: 开发时引用的是SDK内部路径'../src'，实际使用时请修改为SDK包名'mzapi'
import { LexerAnalysis } from '../src/NLP/LexerAnalysis';

// 百度AI开放平台应用的API Key和Secret Key
const clientId = '*****gG8eu';
const clientSecret = '*****kJ7gD';

async function main() {
    try {
        // 初始化词法分析器
        const lexer = new LexerAnalysis(clientId,clientSecret);

        // 待分析的文本
        const text = '百度是一家高科技公司，总部位于北京海淀区。';

        console.log('开始词法分析...');
        console.log(`分析文本: ${text}`);

        // 执行词法分析
        const result = await lexer.analyze(text);

        console.log('\n词法分析结果:');
        console.log(`原始文本: ${result.text}`);

        console.log('\n分析项:');
        result.items.forEach(item => {
            console.log(`- 词语: ${item.item}`);
            console.log(`  词性: ${item.pos}`);
            console.log(`  命名实体: ${item.ne || '无'}`);
            console.log(`  字节偏移: ${item.byte_offset}`);
            console.log(`  字节长度: ${item.byte_length}`);

            if (item.basic_words && item.basic_words.length > 0) {
                console.log(`  基本词: ${item.basic_words.join(', ')}`);
            }

            if (item.loc_details) {
                console.log('  位置详情:');
                item.loc_details.forEach(detail => {
                    console.log(`    - 类型: ${detail.type}, 偏移: ${detail.byte_offset}, 长度: ${detail.byte_length}`);
                });
            }

            console.log();
        });

    } catch (error) {
        console.error('词法分析出错:', error instanceof Error ? error.message : String(error));
    }
}

main();