import { GeneralBasicOCRClient } from './GeneralBasicOCR';
import { GeneralBasicOCRRequest, GeneralBasicOCRResponse } from '../../type';

// 初始化客户端
const client = new GeneralBasicOCRClient({
    secretId: 'AKID*******',
    secretKey: 'MWTJ***kR6a',
});

// 打印OCR识别结果的详细信息
function printOCRResult(response: GeneralBasicOCRResponse, isPdf: boolean = false) {
    console.log('检测到的语言类型:', response.Language);
    console.log('图片旋转角度:', response.Angle);
    if (isPdf) {
        console.log('PDF总页数:', response.PdfPageSize);
    }

    // 显示详细的文本识别结果
    console.log('\n识别到的文本行:');
    response.TextDetections.forEach((text, index) => {
        console.log(`\n第${index + 1}行:`);
        console.log(`  文本内容: ${text.DetectedText}`);
        console.log(`  置信度: ${text.Confidence}%`);

        // 显示文本行坐标（四个顶点）
        if (text.Polygon) {
            console.log('  文本行坐标:');
            text.Polygon.forEach((coord, coordIndex) => {
                console.log(`    顶点${coordIndex + 1}: (${coord.X}, ${coord.Y})`);
            });
        }

        // 显示旋转纠正后的坐标
        console.log(`  纠正后坐标: 左上角(${text.ItemPolygon.X}, ${text.ItemPolygon.Y}), 宽度:${text.ItemPolygon.Width}, 高度:${text.ItemPolygon.Height}`);

        // 显示单字信息（如果有）
        if (text.Words && text.Words.length > 0) {
            console.log('  单字信息:');
            text.Words.forEach((word, wordIndex) => {
                console.log(`    字${wordIndex + 1}: '${word.Character}' (置信度: ${word.Confidence}%)`);
            });
        }
    });
}

// 示例1: 使用图片URL进行OCR识别
async function exampleWithUrl() {
    try {
        const request: GeneralBasicOCRRequest = {
            ImageUrl: 'https://ocr-demo-1254418846.cos.ap-guangzhou.myqcloud.com/general/GeneralBasicOCR/GeneralBasicOCR1.jpg', // 替换为实际的图片URL
            LanguageType: 'auto' // 可选，自动识别语言类型
        };

        const response = await client.GeneralBasicOCR(request);
        console.log('OCR识别结果:');
        console.log('完整响应数据:', JSON.stringify(response, null, 2))
        printOCRResult(response);
    } catch (error) {
        console.error('OCR识别失败:', error);
    }
}

// 示例2: 使用Base64编码图片进行OCR识别
async function exampleWithBase64() {
    try {
        // 从URL获取图片并转换为Base64编码
        const https = require('https');
        
        // 使用指定的图片URL
        const imageUrl = 'https://ocr-demo-1254418846.cos.ap-guangzhou.myqcloud.com/general/GeneralBasicOCR/GeneralBasicOCR1.jpg';
        
        // 从URL获取图片数据
        const imageBuffer: Buffer = await new Promise<Buffer>((resolve, reject) => {
            https.get(imageUrl, (response: any) => {
                const data: any[] = [];
                response.on('data', (chunk: any) => data.push(chunk));
                response.on('end', () => resolve(Buffer.concat(data)));
                response.on('error', reject);
            }).on('error', reject);
        });
        
        // 转换为Base64编码
        const imageBase64 = imageBuffer.toString('base64');
        
        const request: GeneralBasicOCRRequest = {
            ImageBase64: imageBase64,
            LanguageType: 'auto' // 可选，自动识别语言类型
        };

        const response = await client.GeneralBasicOCR(request);
        console.log('OCR识别结果 (Base64):');
        console.log('完整响应数据:', JSON.stringify(response, null, 2))
        printOCRResult(response);
    } catch (error) {
        console.error('OCR识别失败:', error);
    }
}

// 运行示例
async function runExamples() {
    await exampleWithUrl();
    // 运行Base64示例
    await exampleWithBase64();
}

runExamples().catch(console.error);