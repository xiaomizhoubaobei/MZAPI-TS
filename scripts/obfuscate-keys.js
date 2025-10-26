const fs = require('fs');
const path = require('path');

/**
 * 模糊化处理代码中的secretId和secretKey
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

  // 检查是否包含secretId或secretKey
  if (!content.includes('secretId') && !content.includes('secretKey')) {
    return; // 如果不包含敏感信息，直接返回
  }

  // 模糊化处理secretId和secretKey的值，前后一共保留5位字符
  content = content.replace(/(secretId\s*:\s*['"])([^'"])([^'"]{0,3})([^'"]*?)([^'"]{0,3})([^'"])(['"])/g, (match, prefix, first, start, middle, end, last, suffix) => {
    const total = first + start + end + last;
    if (total.length <= 5) {
      // 如果总长度不足5位，保留所有字符并添加***
      return prefix + total + '***' + suffix;
    } else {
      // 如果总长度超过5位，保留前后共5位
      return prefix + first + start + '***' + end + last + suffix;
    }
  });
  
  content = content.replace(/(secretKey\s*:\s*['"])([^'"])([^'"]{0,3})([^'"]*?)([^'"]{0,3})([^'"])(['"])/g, (match, prefix, first, start, middle, end, last, suffix) => {
    const total = first + start + end + last;
    if (total.length <= 5) {
      // 如果总长度不足5位，保留所有字符并添加***
      return prefix + total + '***' + suffix;
    } else {
      // 如果总长度超过5位，保留前后共5位
      return prefix + first + start + '***' + end + last + suffix;
    }
  });

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
