// 注意: 开发时引用的是SDK内部路径'../src'，实际使用时请修改为SDK包名'mzapi'
import { CommentTagging } from '../src/NLP/CommentTagging';

// 替换为你的百度API Key和Secret Key
const CLIENT_ID = 'bsdK1sS6WitJpiSLqgrgG8eu';
const CLIENT_SECRET = 'NsEgyu5MLYuNPZOoL9qORlzyzUCkJ7gD';

async function main() {
    try {
        const commentTagging = new CommentTagging(CLIENT_ID, CLIENT_SECRET);
        
        // 示例1: 餐饮美食评论
        const foodComment = '这家餐厅的菜品味道很好，但服务有点慢';
        const foodResult = await commentTagging.tag(foodComment, 4);
        console.log('餐饮美食评论分析结果:', foodResult);
        
    } catch (error) {
        console.error('发生错误:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

main();