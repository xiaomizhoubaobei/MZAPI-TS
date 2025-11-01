// 简单的模糊测试目标函数
function fuzz(data) {
  // 将模糊数据转换为字符串进行测试
  const inputString = data.toString('utf-8');
  
  // 简单的测试：检查字符串长度
  if (inputString.length > 0) {
    console.log(`Fuzzing with input length: ${inputString.length}`);
  }
}

module.exports = { fuzz };