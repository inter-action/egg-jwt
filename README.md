# egg jwt plugin
构建在 [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) 库之上的 egg jwt插件, 具体选项配置请移步.


## config
插件的默认配置


```
export const jwt: Config = {
  contextKey: 'session', // 注入到 ctx.session 中
  key: 'egg-jwt',        // jwt 默认的加密key
  expiresIn: '1d',       // 过期时间
  header: 'Authorization' // http 的头的field
}
```
