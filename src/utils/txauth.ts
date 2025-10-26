import * as crypto from 'crypto';

export interface TencentCloudAuthOptions {
  secretId: string;
  secretKey: string;
}

export interface TencentCloudRequestConfig {
  method: string;
  url: string;
  payload: any;
  service: string;
  action: string;
  version: string;
  region: string;
}

export class TencentCloudAuth {
  private secretId: string;
  private secretKey: string;

  constructor(options: TencentCloudAuthOptions) {
    this.secretId = options.secretId;
    this.secretKey = options.secretKey;
  }

  /**
   * 生成腾讯云API鉴权签名
   * @param config 请求配置
   * @returns 包含Authorization头部和其他必要头部的对象
   */
  public generateAuthorization(config: TencentCloudRequestConfig): { [key: string]: string } {
    // 1. 拼接规范请求串 CanonicalRequest
    const HTTPRequestMethod = config.method;
    const CanonicalURI = '/';
    const CanonicalQueryString = '';
    const CanonicalHeaders = `content-type:application/json
host:${new URL(config.url).hostname}
`;
    const SignedHeaders = 'content-type;host';

    const HashedRequestPayload = crypto
      .createHash('sha256')
      .update(JSON.stringify(config.payload))
      .digest('hex');

    const CanonicalRequest = `${HTTPRequestMethod}
${CanonicalURI}
${CanonicalQueryString}
${CanonicalHeaders}
${SignedHeaders}
${HashedRequestPayload}`;

    // 2. 拼接待签名字符串
    const Algorithm = 'TC3-HMAC-SHA256';
    const RequestTimestamp = Math.round(new Date().getTime() / 1000) + '';
    const date = new Date().toISOString().substr(0, 10);

    const CredentialScope = `${date}/${config.service}/tc3_request`;

    const HashedCanonicalRequest = crypto
      .createHash('sha256')
      .update(CanonicalRequest)
      .digest('hex');

    const StringToSign = `${Algorithm}
${RequestTimestamp}
${CredentialScope}
${HashedCanonicalRequest}`;

    // 3. 计算签名
    const SecretDate = crypto
      .createHmac('sha256', 'TC3' + this.secretKey)
      .update(date)
      .digest();
    const SecretService = crypto
      .createHmac('sha256', SecretDate)
      .update(config.service)
      .digest();
    const SecretSigning = crypto
      .createHmac('sha256', SecretService)
      .update('tc3_request')
      .digest();
    const Signature = crypto
      .createHmac('sha256', SecretSigning)
      .update(StringToSign)
      .digest('hex');

    // 4. 拼接Authorization
    const Authorization = `${Algorithm} Credential=${this.secretId}/${CredentialScope}, SignedHeaders=${SignedHeaders}, Signature=${Signature}`;

    // 返回请求所需的头部信息
    return {
      'Content-Type': 'application/json',
      Authorization,
      Host: new URL(config.url).hostname,
      'X-TC-Action': config.action,
      'X-TC-Version': config.version,
      'X-TC-Timestamp': RequestTimestamp,
      'X-TC-Region': config.region,
    };
  }
}
