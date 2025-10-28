const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

/**
 * 验证文件路径是否安全
 * @param {string} filePath 文件路径
 * @param {string} baseDir 基准目录
 * @returns {boolean} 是否为安全路径
 */
function isSafePath(filePath, baseDir) {
  // 解析绝对路径
  const resolvedPath = path.resolve(filePath);
  const resolvedBaseDir = path.resolve(baseDir);
  
  // 检查文件是否在基准目录内
  return resolvedPath.startsWith(resolvedBaseDir);
}

/**
 * 验证文件类型是否支持处理
 * @param {string} filePath 文件路径
 * @returns {boolean} 是否支持处理的文件类型
 */
function isSupportedFileType(filePath) {
  const supportedExtensions = ['.js', '.ts', '.jsx', '.tsx'];
  const ext = path.extname(filePath).toLowerCase();
  return supportedExtensions.includes(ext);
}

/**
 * 对密钥值进行模糊化处理
 * @param {string} value 原始值
 * @param {string} keyName 密钥名称
 * @param {Set} userIdentityKeys 用户身份密钥集合
 * @returns {string} 模糊化后的值
 */
function obfuscateValue(value, keyName, userIdentityKeys) {
  // 验证输入参数
  if (typeof value !== 'string' || typeof keyName !== 'string') {
    throw new Error('Invalid input: value and keyName must be strings');
  }
  
  if (userIdentityKeys.has(keyName)) {
    // 用户身份密钥：保留前后四位，中间用*代替
    if (value.length > 8) {
      return value.substring(0, 4) +
        '*'.repeat(value.length - 8) +
        value.substring(value.length - 4);
    } else {
      return '*'.repeat(value.length);
    }
  } else {
    // 其他密钥：全部替换为*
    return '*'.repeat(value.length);
  }
}

/**
 * 使用 AST 模糊化处理代码中的各种密钥
 * @param {string} filePath 文件路径
 * @param {boolean} dryRun 是否只检查不修改文件
 * @param {string} baseDir 基准目录，用于路径安全检查
 */
function obfuscateKeysWithAST(filePath, dryRun = false, baseDir = './src') {
  // 输入验证
  if (typeof filePath !== 'string') {
    console.error('错误：文件路径必须是字符串');
    return;
  }
  
  // 路径安全检查
  if (!isSafePath(filePath, baseDir)) {
    console.error(`错误：不安全的文件路径 ${filePath}`);
    return;
  }
  
  // 文件类型检查
  if (!isSupportedFileType(filePath)) {
    console.error(`错误：不支持的文件类型 ${filePath}`);
    return;
  }

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    console.log(`文件不存在: ${filePath}`);
    return;
  }

  // 读取文件内容
  const content = fs.readFileSync(filePath, 'utf8');

  try {
    // 解析代码生成 AST
    const ast = parser.parse(content, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'], // 支持 TypeScript 和 JSX
    });

    // 定义需要模糊化的密钥名称
    const keyNames = new Set([
      'secretId', 'secretKey', 'accessKeyId', 'accessKeySecret', 'apiKey', 'apiSecret',
      'clientId', 'clientSecret', 'token', 'password', 'authKey', 'privateKey',
      'publicKey', 'credential', 'authToken', 'sessionId', 'refreshToken', 'oauthToken',
      'bearerToken', 'encryptionKey', 'signingKey', 'appKey', 'appSecret', 'consumerKey',
      'consumerSecret', 'licenseKey', 'licenseId', 'securityToken', 'masterKey',
      'serviceAccountKey', 'integrationKey', 'webhookSecret', 'databaseUrl',
      'connectionString', 'secretToken', 'jwtSecret', 'jwtKey', 'encryptionKey',
      'decryptionKey', 'hashKey', 'salt', 'iv', 'certificate', 'cert', 'sslKey',
      'sslCertificate', 'oauthClientId', 'oauthClientSecret', 'ssoToken', 'apiToken',
      'restApiKey', 'apiKeyId', 'apiAccessToken', 'graphApiKey', 'graphSecret',
      'analyticsKey', 'trackingId', 'adUnitId', 'adClientId', 'adClientSecret',
      'paymentKey', 'paymentSecret', 'merchantId', 'merchantKey',
    ]);

    // 定义用于表示用户身份的密钥名称
    const userIdentityKeys = new Set([
      'secretId', 'clientId', 'userId', 'username', 'email', 'phoneNumber',
      'userToken', 'sessionToken', 'authToken', 'refreshToken', 'oauthToken',
      'ssoToken', 'apiToken', 'restApiKey', 'apiKeyId', 'apiAccessToken',
      'graphApiKey', 'graphSecret', 'analyticsKey', 'trackingId', 'adUnitId',
      'paymentKey', 'paymentSecret', 'merchantId', 'merchantKey',
    ]);

    let hasKeys = false;

    // 遍历 AST
    traverse(ast, {
      ObjectProperty(path) {
        // 检查对象属性的键是否是需要模糊化的密钥名称
        if (
          (t.isIdentifier(path.node.key) && keyNames.has(path.node.key.name)) ||
          (t.isStringLiteral(path.node.key) && keyNames.has(path.node.key.value))
        ) {
          // 检查属性值是否是字符串字面量
          if (t.isStringLiteral(path.node.value)) {
            hasKeys = true;
            
            // 在上方添加注释说明
            const keyName = t.isIdentifier(path.node.key)
              ? path.node.key.name
              : path.node.key.value;
              
            const comment = `// 注意：在实际使用时，应该填入您的真实${keyName}`;
            path.getStatementParent().addComment('leading', comment);

            // 对值进行模糊化处理
            const obfuscatedValue = obfuscateValue(path.node.value.value, keyName, userIdentityKeys);

            path.node.value.value = obfuscatedValue;
            path.node.value.extra = {
              raw: JSON.stringify(path.node.value.value),
              rawValue: path.node.value.value,
            };
          }
        }
      },
    });

    // 生成修改后的代码
    const output = generate(ast, {}, content);

    // 只有在确实进行了修改的情况下才写入文件
    if (output.code !== content) {
      if (!dryRun) {
        // 写入修改后的内容
        fs.writeFileSync(filePath, output.code, 'utf8');
        console.log(`已模糊化处理: ${filePath}`);
      } else {
        console.log(`[DRY RUN] 将会模糊化处理: ${filePath}`);
      }
    } else {
      console.log(`未发现需要模糊化的密钥: ${filePath}`);
    }
  } catch (error) {
    console.error(`处理文件时出错: ${filePath}`, error.message);
  }
}

/**
 * 递归遍历目录，处理所有.ts和.js文件
 * @param {string} dir 目录路径
 * @param {boolean} dryRun 是否只检查不修改文件
 * @param {string} baseDir 基准目录，用于路径安全检查
 */
function processDirectory(dir, dryRun = false, baseDir = './src') {
  // 输入验证
  if (typeof dir !== 'string') {
    console.error('错误：目录路径必须是字符串');
    return;
  }
  
  // 路径安全检查
  if (!isSafePath(dir, baseDir)) {
    console.error(`错误：不安全的目录路径 ${dir}`);
    return;
  }

  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // 递归处理子目录，但跳过node_modules
      if (file !== 'node_modules') {
        processDirectory(filePath, dryRun, baseDir);
      }
    } else if (stat.isFile() && isSupportedFileType(file)) {
      // 处理支持的文件类型
      obfuscateKeysWithAST(filePath, dryRun, baseDir);
    }
  });
}

// 获取命令行参数
const args = process.argv.slice(2);
const targetDir = './src'; // 固定只扫描/src目录
let dryRun = false;

// 解析命令行参数
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--dry-run' || args[i] === '-d') {
    dryRun = true;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
用法: node obfuscate-keys.js [选项]

选项:
  -d, --dry-run  只检查不修改文件
  -h, --help     显示帮助信息

目标目录: ./src (固定)
    `);
    process.exit(0);
  }
}

console.log(`目标目录: ${targetDir}`);
if (dryRun) {
  console.log('运行模式: 检查模式（不会修改文件）');
}

// 处理指定目录
processDirectory(targetDir, dryRun, targetDir);

// 如果是检查模式，添加总结信息
if (dryRun) {
  console.log('\n检查完成。使用不带 --dry-run 参数的命令来实际修改文件。');
}