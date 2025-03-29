# Git 提交签名指南

为了确保代码提交的安全性和可信度，我们要求所有提交必须进行签名。本指南将帮助您设置和使用Git提交签名。

## 1. 生成 GPG 密钥

1. 安装 GPG
   - Windows: 下载并安装 [Gpg4win](https://www.gpg4win.org/)
   - macOS: `brew install gnupg`
   - Linux: `sudo apt-get install gnupg`

2. 生成新的 GPG 密钥：
   ```bash
   gpg --full-generate-key
   ```
   - 选择密钥类型：选择 RSA and RSA
   - 密钥长度：建议 4096 位
   - 密钥有效期：根据需要设置
   - 输入您的用户信息（与Git配置相同的邮箱）

3. 查看 GPG 密钥：
   ```bash
   gpg --list-secret-keys --keyid-format LONG
   ```

4. 获取密钥 ID：
   ```bash
   gpg --list-secret-keys --keyid-format LONG
   ```
   从输出中复制以 "sec" 开头的行中的密钥 ID（形如：3AA5C34371567BD2）

## 2. 配置 Git

1. 设置签名密钥：
   ```bash
   git config --global user.signingkey 你的密钥ID
   ```

2. 启用自动签名提交：
   ```bash
   git config --global commit.gpgsign true
   ```

3. 如果使用 GPG Suite，配置 GPG 程序路径：
   ```bash
   git config --global gpg.program gpg
   ```

## 3. 添加 GPG 公钥到 GitHub

1. 导出 GPG 公钥：
   ```bash
   gpg --armor --export 你的密钥ID
   ```

2. 复制输出的公钥（从 BEGIN PGP PUBLIC KEY BLOCK 到 END PGP PUBLIC KEY BLOCK）

3. 在 GitHub 设置中添加 GPG 密钥：
   - 访问 GitHub Settings > SSH and GPG keys
   - 点击 "New GPG key"
   - 粘贴公钥并保存

## 4. 使用签名提交

现在，您的提交将自动使用 GPG 密钥签名。如果需要手动签名单个提交：

```bash
# 使用 -S 参数进行签名提交
git commit -S -m "你的提交信息"
```

## 5. 验证签名配置

要验证签名是否正确配置：

```bash
# 提交后查看提交历史
git log --show-signature
```

## 常见问题

1. 如果遇到 "signing failed: secret key not available"：
   - 确保 GPG 密钥 ID 配置正确
   - 检查 GPG 密钥是否已导入

2. 如果遇到 "gpg: signing failed: No pinentry"：
   - 安装 pinentry-mac（macOS）
   - 配置 GPG 代理

3. 在 Windows 上可能需要额外配置：
   ```bash
   git config --global gpg.program "C:/Program Files (x86)/GnuPG/bin/gpg.exe"
   ```

## 注意事项

- 保持私钥安全，不要分享给他人
- 定期备份 GPG 密钥
- 如果更换计算机，需要重新导入密钥
- 确保 Git 配置的邮箱与 GPG 密钥的邮箱一致