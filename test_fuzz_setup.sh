#!/bin/bash

# 简单测试脚本，验证模糊测试环境
echo "Testing fuzzing environment setup..."

# 检查是否安装了 jazzer
if npx jazzer --help > /dev/null 2>&1; then
  echo "✓ Jazzer.js is available"
else
  echo "✗ Jazzer.js is not available"
  exit 1
fi

# 检查 package.json 中的 fuzz 脚本
if grep -q '"fuzz"' package.json; then
  echo "✓ Fuzz script is configured in package.json"
else
  echo "✗ Fuzz script is not configured in package.json"
  exit 1
fi

# 检查 fuzzing 目录和文件
if [ -d "fuzzing" ] && [ -f "fuzzing/fuzz_ocr_client.ts" ]; then
  echo "✓ Fuzzing directory and test file exist"
else
  echo "✗ Fuzzing directory or test file missing"
  exit 1
fi

echo "All checks passed! Fuzzing environment is ready."
echo "To run a quick fuzz test, execute: npm run fuzz"