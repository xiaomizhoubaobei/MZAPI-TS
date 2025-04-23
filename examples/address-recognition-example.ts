// 注意: 开发时引用的是SDK内部路径'../src'，实际使用时请修改为SDK包名'mzapi'
import {AddressRecognition} from '../src';


async function addressRecognitionExample() {
    // 创建地址识别实例（请替换为实际的API Key和Secret Key）
    const clientId = '*****gG8eu';
    const clientSecret = '*****kJ7gD';
    const addressRecognition = new AddressRecognition(clientId, clientSecret);

    try {
        // 示例地址文本
        const addressText = '上海市浦东新区纳贤路701号百度上海研发中心 F4A000 张三';
        
        // 调用地址识别API
        const result = await addressRecognition.recognize(addressText);
        
        // 输出识别结果
        console.log('识别结果：', result);
    } catch (error) {
        console.error('地址识别失败：', error);
    }
}

// 运行示例
addressRecognitionExample().catch(error => {
    console.error('运行示例时发生错误：', error);
    process.exit(1);
});