
declare module 'egg' {
  interface Context {
    /**
     * 对object进行签名, 生成token
     * 
     * @param payload 
     */
    jwtSign(payload: any, options?: any): Promise<string>;

    /**
     * 对token进行解密, 生成原始token
     * 
     * @param token 
     */
    jwtVerify(token: string, options?: any): Promise<object>;
  }

  interface EggAppConfig {

  }
}