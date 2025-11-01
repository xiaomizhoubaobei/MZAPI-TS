#!/bin/bash

# 编译并运行模糊测试的脚本

echo "Compiling TypeScript files..."
yarn tsc --outDir dist/fuzzing --module commonjs fuzzing/fuzz_ocr_client.ts

if [ $? -eq 0 ]; then
  echo "Compilation successful. Running fuzz test..."
  # 检查是否提供了最大运行次数参数
  if [ -z "$1" ]; then
    # 默认运行30秒
    timeout 30s yarn jazzer dist/fuzzing/fuzzing/fuzz_ocr_client.js fuzzing/corpus
  else
    # 使用提供的最大运行次数
    timeout $1 yarn jazzer dist/fuzzing/fuzzing/fuzz_ocr_client.js fuzzing/corpus
  fi
else
  echo "Compilation failed. Please check the TypeScript files."
  exit 1
fi