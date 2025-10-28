const fs = require('fs');
const path = require('path');

/**
 * 模糊化处理代码中的各种密钥
 * @param {string} filePath 文件路径
 */
function obfuscateKeys(filePath) {
 // 检查文件是否存在
 if (!fs.existsSync(filePath)) {
  console.log(`文件不存在: ${filePath}`);
  return;
 }

 // 读取文件内容
 let content = fs.readFileSync(filePath, 'utf8');

 // 定义需要模糊化的密钥类型
 const keyPatterns = [
  { pattern: /(secretId\s*:\s*['"])([^'"]+)(['"])/g, name: 'secretId' },
  { pattern: /(secretKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'secretKey' },
  { pattern: /(accessKeyId\s*:\s*['"])([^'"]+)(['"])/g, name: 'accessKeyId' },
  { pattern: /(accessKeySecret\s*:\s*['"])([^'"]+)(['"])/g, name: 'accessKeySecret' },
  { pattern: /(apiKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'apiKey' },
  { pattern: /(apiSecret\s*:\s*['"])([^'"]+)(['"])/g, name: 'apiSecret' },
  { pattern: /(clientId\s*:\s*['"])([^'"]+)(['"])/g, name: 'clientId' },
  { pattern: /(clientSecret\s*:\s*['"])([^'"]+)(['"])/g, name: 'clientSecret' },
  { pattern: /(token\s*:\s*['"])([^'"]+)(['"])/g, name: 'token' },
  { pattern: /(password\s*:\s*['"])([^'"]+)(['"])/g, name: 'password' },
  { pattern: /(authKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'authKey' },
  { pattern: /(privateKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'privateKey' },
  { pattern: /(publicKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'publicKey' },
  { pattern: /(credential\s*:\s*['"])([^'"]+)(['"])/g, name: 'credential' },
  { pattern: /(authToken\s*:\s*['"])([^'"]+)(['"])/g, name: 'authToken' },
  { pattern: /(sessionId\s*:\s*['"])([^'"]+)(['"])/g, name: 'sessionId' },
  { pattern: /(refreshToken\s*:\s*['"])([^'"]+)(['"])/g, name: 'refreshToken' },
  { pattern: /(oauthToken\s*:\s*['"])([^'"]+)(['"])/g, name: 'oauthToken' },
  { pattern: /(bearerToken\s*:\s*['"])([^'"]+)(['"])/g, name: 'bearerToken' },
  { pattern: /(encryptionKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'encryptionKey' },
  { pattern: /(signingKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'signingKey' },
  { pattern: /(appKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'appKey' },
  { pattern: /(appSecret\s*:\s*['"])([^'"]+)(['"])/g, name: 'appSecret' },
  { pattern: /(consumerKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'consumerKey' },
  { pattern: /(consumerSecret\s*:\s*['"])([^'"]+)(['"])/g, name: 'consumerSecret' },
  { pattern: /(licenseKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'licenseKey' },
  { pattern: /(licenseId\s*:\s*['"])([^'"]+)(['"])/g, name: 'licenseId' },
  { pattern: /(securityToken\s*:\s*['"])([^'"]+)(['"])/g, name: 'securityToken' },
  { pattern: /(masterKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'masterKey' },
  { pattern: /(serviceAccountKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'serviceAccountKey' },
  { pattern: /(integrationKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'integrationKey' },
  { pattern: /(webhookSecret\s*:\s*['"])([^'"]+)(['"])/g, name: 'webhookSecret' },
  { pattern: /(databaseUrl\s*:\s*['"])([^'"]+)(['"])/g, name: 'databaseUrl' },
  { pattern: /(connectionString\s*:\s*['"])([^'"]+)(['"])/g, name: 'connectionString' },
  { pattern: /(secretToken\s*:\s*['"])([^'"]+)(['"])/g, name: 'secretToken' },
  { pattern: /(jwtSecret\s*:\s*['"])([^'"]+)(['"])/g, name: 'jwtSecret' },
  { pattern: /(jwtKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'jwtKey' },
  { pattern: /(encryptionKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'encryptionKey' },
  { pattern: /(decryptionKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'decryptionKey' },
  { pattern: /(hashKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'hashKey' },
  { pattern: /(salt\s*:\s*['"])([^'"]+)(['"])/g, name: 'salt' },
  { pattern: /(iv\s*:\s*['"])([^'"]+)(['"])/g, name: 'iv' },
  { pattern: /(certificate\s*:\s*['"])([^'"]+)(['"])/g, name: 'certificate' },
  { pattern: /(cert\s*:\s*['"])([^'"]+)(['"])/g, name: 'cert' },
  { pattern: /(sslKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'sslKey' },
  { pattern: /(sslCertificate\s*:\s*['"])([^'"]+)(['"])/g, name: 'sslCertificate' },
  { pattern: /(oauthClientId\s*:\s*['"])([^'"]+)(['"])/g, name: 'oauthClientId' },
  { pattern: /(oauthClientSecret\s*:\s*['"])([^'"]+)(['"])/g, name: 'oauthClientSecret' },
  { pattern: /(ssoToken\s*:\s*['"])([^'"]+)(['"])/g, name: 'ssoToken' },
  { pattern: /(apiToken\s*:\s*['"])([^'"]+)(['"])/g, name: 'apiToken' },
  { pattern: /(restApiKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'restApiKey' },
  { pattern: /(apiKeyId\s*:\s*['"])([^'"]+)(['"])/g, name: 'apiKeyId' },
  { pattern: /(apiAccessToken\s*:\s*['"])([^'"]+)(['"])/g, name: 'apiAccessToken' },
  { pattern: /(graphApiKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'graphApiKey' },
  { pattern: /(graphSecret\s*:\s*['"])([^'"]+)(['"])/g, name: 'graphSecret' },
  { pattern: /(analyticsKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'analyticsKey' },
  { pattern: /(trackingId\s*:\s*['"])([^'"]+)(['"])/g, name: 'trackingId' },
  { pattern: /(adUnitId\s*:\s*['"])([^'"]+)(['"])/g, name: 'adUnitId' },
  { pattern: /(adClientId\s*:\s*['"])([^'"]+)(['"])/g, name: 'adClientId' },
  { pattern: /(adClientSecret\s*:\s*['"])([^'"]+)(['"])/g, name: 'adClientSecret' },
  { pattern: /(paymentKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'paymentKey' },
  { pattern: /(paymentSecret\s*:\s*['"])([^'"]+)(['"])/g, name: 'paymentSecret' },
  { pattern: /(merchantId\s*:\s*['"])([^'"]+)(['"])/g, name: 'merchantId' },
  { pattern: /(merchantKey\s*:\s*['"])([^'"]+)(['"])/g, name: 'merchantKey' },
 ];

 // 检查是否包含任何密钥
 let hasKeys = false;
 for (const keyPattern of keyPatterns) {
  if (keyPattern.pattern.test(content)) {
   hasKeys = true;
   break;
  }
 }

 if (!hasKeys) {
  return; // 如果不包含敏感信息，直接返回
 }

 // 重置正则表达式的 lastIndex 属性
 for (const keyPattern of keyPatterns) {
  keyPattern.pattern.lastIndex = 0;
 }

 // 模糊化处理各种密钥的值，全部替换为*
 // 并在上方添加注释说明
 for (const keyPattern of keyPatterns) {
  content = content.replace(keyPattern.pattern, (match, prefix, secret, suffix) => {
   return (
    `// 注意：在实际使用时，应该填入您的真实${keyPattern.name}\n` +
    prefix +
    '*'.repeat(secret.length) +
    suffix
   );
  });
 }

 // 写入修改后的内容
 fs.writeFileSync(filePath, content, 'utf8');
 console.log(`已模糊化处理: ${filePath}`);
}

/**
 * 递归遍历目录，处理所有.ts和.js文件
 * @param {string} dir 目录路径
 */
function processDirectory(dir) {
 const files = fs.readdirSync(dir);

 files.forEach(file => {
  const filePath = path.join(dir, file);
  const stat = fs.statSync(filePath);

  if (stat.isDirectory()) {
   // 递归处理子目录，但跳过node_modules
   if (file !== 'node_modules') {
    processDirectory(filePath);
   }
  } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.js'))) {
   // 处理.ts和.js文件
   obfuscateKeys(filePath);
  }
 });
}

// 获取命令行参数指定的目录
const targetDir = process.argv[2] || './src';

// 处理指定目录
processDirectory(targetDir);
