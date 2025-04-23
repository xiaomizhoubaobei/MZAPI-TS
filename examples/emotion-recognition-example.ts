// 注意: 开发时引用的是SDK内部路径'../src'，实际使用时请修改为SDK包名'mzapi'
import { EmotionRecognition } from "../src/NLP/EmotionRecognition";

async function emotionRecognitionExample() {
    // 创建情绪识别实例（请替换为实际的API Key和Secret Key）
    const clientId = '*****gG8eu';
    const clientSecret = '*****kJ7gD';
    const emotionRecognition = new EmotionRecognition(clientId, clientSecret);

    try {
        const text1 = '今天天气真好，心情特别愉快！';
        const result = await emotionRecognition.recognize(text1);
        
        console.log('输入文本：', result.text);
        console.log('请求ID：', result.log_id);
        console.log('情绪分析结果：');
        
        result.items.forEach((item, i) => {
            console.log(`  ${i+1}. 一级情绪: ${item.label} (概率: ${item.prob.toFixed(5)})`);
            
            if(item.subitems && item.subitems.length > 0) {
                item.subitems.forEach((subitem) => {
                    console.log(`    - 二级情绪: ${subitem.label} (概率: ${subitem.prob.toFixed(5)})`);
                    
                    if(subitem.replies && subitem.replies.length > 0) {
                        console.log('      推荐回复：');
                        subitem.replies.forEach((reply, k) => {
                            console.log(`        ${k+1}. ${reply}`);
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error('情绪识别失败：', error);
    }
}

// 执行示例
emotionRecognitionExample();