import { GeneralBasicOCRClient, OCRError } from './GeneralBasicOCR';
import { GeneralBasicOCRRequest, GeneralBasicOCRResponse } from '../../type';
import winston from 'winston';
import https from 'https';

const { combine, timestamp, printf } = winston.format;


// 注意：在实际使用时，应该填入您的真实secretId
const  secretId = '************************************';
// 注意：在实际使用时，应该填入您的真实secretKey
const  secretKey = '********************************';
// 创建自定义日志格式
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// 创建审计日志格式
const auditFormat = printf(({ level, message, timestamp, userId, action, result }) => {
    if (level === 'audit') {
        return `${timestamp} [AUDIT]: User=${userId}, Action=${action}, Result=${result}, Message=${message}`;
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// 创建winston日志记录器
const logger = winston.createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

// 创建专门用于审计的日志记录器
const auditLogger = winston.createLogger({
    level: 'audit',
    format: combine(
        timestamp(),
        auditFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

// 初始化客户端
const client = new GeneralBasicOCRClient({
  secretId, secretKey,
});

// 记录客户端初始化的审计日志
auditLogger.log({
    level: 'audit',
    userId: secretId,
    action: 'INIT_CLIENT',
    result: 'SUCCESS',
    message: 'OCR client initialized'
});

// 打印OCR识别结果的详细信息
function printOCRResult(response: GeneralBasicOCRResponse, isPdf: boolean = false) {
    logger.info(`检测到的语言类型: ${response.Language}`);
    logger.info(`图片旋转角度: ${response.Angle}`);
    if (isPdf) {
        logger.info(`PDF总页数: ${response.PdfPageSize}`);
    }

    // 显示详细的文本识别结果
    logger.info('\n识别到的文本行:');
    response.TextDetections.forEach((text, index) => {
        logger.info(`\n第${index + 1}行:`);
        logger.info(`  文本内容: ${text.DetectedText}`);
        logger.info(`  置信度: ${text.Confidence}%`);

        // 显示文本行坐标（四个顶点）
        if (text.Polygon) {
            logger.info('  文本行坐标:');
            text.Polygon.forEach((coord, coordIndex) => {
                logger.info(`    顶点${coordIndex + 1}: (${coord.X}, ${coord.Y})`);
            });
        }

        // 显示旋转纠正后的坐标
        logger.info(`  纠正后坐标: 左上角(${text.ItemPolygon.X}, ${text.ItemPolygon.Y}), 宽度:${text.ItemPolygon.Width}, 高度:${text.ItemPolygon.Height}`);

        // 显示单字信息（如果有）
        if (text.Words && text.Words.length > 0) {
            logger.info('  单字信息:');
            text.Words.forEach((word, wordIndex) => {
                logger.info(`    字${wordIndex + 1}: '${word.Character}' (置信度: ${word.Confidence}%)`);
            });
        }
    });
}

// 安全地记录错误信息，不泄露敏感系统信息
function logSecureError(error: OCRError | Error, context: string) {
    if (error instanceof OCRError) {
        // 仅记录错误代码和一般性错误信息
        logger.error(`[${context}] OCR处理失败 - 错误代码: ${error.code}, 信息: ${error.message}`);
        
        // 仅在调试模式下记录详细信息，且不包含敏感字段
        if (process.env.NODE_ENV === 'development') {
            logger.debug(`[${context}] 错误详情: ${JSON.stringify({
                code: error.code,
                message: error.message,
                // 不包含可能的敏感信息如堆栈跟踪
                hasDetails: !!error.details
            })}`);
        }
    } else {
        // 处理非OCRError类型的错误
        logger.error(`[${context}] 处理失败 - 信息: ${error.message || '未知错误'}`);
        
        // 仅在开发环境下记录额外信息
        if (process.env.NODE_ENV === 'development') {
            logger.debug(`[${context}] 非OCRError错误: ${typeof error}`);
        }
    }
}

// 示例1: 使用图片URL进行OCR识别
async function exampleWithUrl() {
    
    // 记录OCR调用开始的审计日志
    auditLogger.log({
        level: 'audit',
        userId: secretId,
        action: 'OCR_URL_REQUEST',
        result: 'START',
        message: 'Starting OCR recognition with URL'
    });
    
    try {
        const request: GeneralBasicOCRRequest = {
            ImageUrl: 'https://ocr-demo-1254418846.cos.ap-guangzhou.myqcloud.com/general/GeneralBasicOCR/GeneralBasicOCR1.jpg', // 替换为实际的图片URL
            LanguageType: 'auto' // 可选，自动识别语言类型
        };

        const response = await client.GeneralBasicOCR(request);
        
        // 记录OCR调用成功的审计日志
        auditLogger.log({
            level: 'audit',
            userId: secretId,
            action: 'OCR_URL_REQUEST',
            result: 'SUCCESS',
            message: `OCR recognition completed successfully with ${response.TextDetections.length} text detections`
        });
        
        logger.info('OCR识别结果:');
        // 仅在开发环境下记录完整响应数据，避免在生产环境中泄露敏感信息
        if (process.env.NODE_ENV === 'development') {
            logger.debug(`完整响应数据: ${JSON.stringify(response, null, 2)}`);
        }
        printOCRResult(response);
    } catch (error) {
        // 记录OCR调用失败的审计日志
        auditLogger.log({
            level: 'audit',
            userId: secretId,
            action: 'OCR_URL_REQUEST',
            result: 'FAILURE',
            message: `OCR recognition failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        
        // 使用安全的错误日志记录
        logSecureError(error as OCRError | Error, 'exampleWithUrl');
    }
}

// 示例2: 使用Base64编码图片进行OCR识别
async function exampleWithBase64(){
    
    // 记录OCR调用开始的审计日志
    auditLogger.log({
        level: 'audit',
        userId: secretId,
        action: 'OCR_BASE64_REQUEST',
        result: 'START',
        message: 'Starting OCR recognition with Base64 image'
    });
    
    try {
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
        
        // 记录OCR调用成功的审计日志
        auditLogger.log({
            level: 'audit',
            userId: secretId,
            action: 'OCR_BASE64_REQUEST',
            result: 'SUCCESS',
            message: `OCR recognition completed successfully with ${response.TextDetections.length} text detections`
        });
        
        logger.info('OCR识别结果 (Base64):');
        // 仅在开发环境下记录完整响应数据，避免在生产环境中泄露敏感信息
        if (process.env.NODE_ENV === 'development') {
            logger.debug(`完整响应数据: ${JSON.stringify(response, null, 2)}`);
        }
        printOCRResult(response);
    } catch (error) {
        // 记录OCR调用失败的审计日志
        auditLogger.log({
            level: 'audit',
            userId: secretId,
            action: 'OCR_BASE64_REQUEST',
            result: 'FAILURE',
            message: `OCR recognition failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
        
        // 使用安全的错误日志记录
        logSecureError(error as OCRError | Error, 'exampleWithBase64');
    }
}

// 运行示例
async function runExamples() {

    // 记录示例运行开始的审计日志
    auditLogger.log({
        level: 'audit',
        userId: secretId,
        action: 'RUN_EXAMPLES',
        result: 'START',
        message: 'Starting OCR examples execution'
    });
    
    await exampleWithUrl();
    // 运行Base64示例
    await exampleWithBase64();
    
    // 记录示例运行完成的审计日志
    auditLogger.log({
        level: 'audit',
        userId: secretId,
        action: 'RUN_EXAMPLES',
        result: 'SUCCESS',
        message: 'OCR examples execution completed'
    });
}

runExamples().catch((error) => {
    
    // 记录示例运行失败的审计日志
    auditLogger.log({
        level: 'audit',
        userId: secretId,
        action: 'RUN_EXAMPLES',
        result: 'FAILURE',
        message: `Error during examples execution: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
    
    // 使用安全的错误日志记录
    logSecureError(error as OCRError | Error, 'runExamples');
});