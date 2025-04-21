import { ERNIE, Message } from '../src';

// 定义鉴权用的鉴权信息
const clientId = '*****2fMWW';
const clientSecret = '*****Lgs2b';
// 示例1: 基本对话
async function basicConversation() {
  try {
    const ernie = new ERNIE(clientId, clientSecret, 'ernie-4.0-8k');

    const messages: Message[] = [
      { role: 'user', content: '你好，请介绍一下你自己' }
    ];

    const response = await ernie.sendRequest(messages);
    console.log('AI回复:', response.result);
  } catch (error) {
    console.error('对话失败:', error instanceof Error ? error.message : String(error));
  }
}

// 示例2: 带参数的对话
async function customConversation() {
  try {
    const ernie = new ERNIE(clientId, clientSecret, 'ernie-4.0-8k');

    const messages: Message[] = [
      { role: 'user', content: '请写一篇关于人工智能的文章' }
    ];

    const response = await ernie.sendRequest(
      messages,
      0.7,  // 较低的temperature使输出更加确定性
      0.9,  // 较高的top_p使输出更加多样
      1.2,  // 适中的重复惩罚
      2048  // 较大的输出长度限制
    );

    console.log('AI回复:', response.result);
  } catch (error) {
    console.error('对话失败:', error instanceof Error ? error.message : String(error));
  }
}

// 示例3: 流式对话
async function streamConversation() {
  try {
    const ernie = new ERNIE(clientId, clientSecret, 'ernie-4.0-8k');
    
    const messages: Message[] = [
      { role: 'user', content: '你是谁' }
    ];
    
    await ernie.streamRequest(
      messages,
      (chunk) => {
        process.stdout.write(chunk); // 实时打印每个文本块
      },
      0.7,    // 降低随机性
      0.8,    // 保持适中的多样性
      1.1,    // 轻微避免重复
      2048    // 允许较长回复
    );
  } catch (error) {
    console.error('流式对话失败:', error instanceof Error ? error.message : String(error));
  }
}

// 示例4: 获取支持的模型列表
function listSupportedModels() {
  const models = ERNIE.getSupportedModels();
  console.log('支持的模型:', models);
}

// 运行示例
(async () => {
  await basicConversation();
  await customConversation();
  await streamConversation();
  listSupportedModels();
})();