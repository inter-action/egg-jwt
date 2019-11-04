import { Context, Application } from 'egg';
import { promisify } from 'util';
import { Config } from '../../config/config';

const jwt = require('jsonwebtoken');

interface JwtSignOption {
  algorithm?: string,
  expiresIn?: string,
}

interface JwtVerifyOptions {

}

type SignFunc = (obj: any, key: any, options?: JwtSignOption) => Promise<string> 
type VerifyFunc = (token: string, key: any, options?: JwtVerifyOptions) => Promise<string>

const sign: SignFunc = promisify(jwt.sign)
const verify: VerifyFunc = promisify(jwt.verify)

module.exports = (config: Config, app: Application) => {
  let contextKey = config.contextKey = config.contextKey || 'session'

  extendContext(app.context, config)

  return async function (ctx: Context, next) {
    let authHeader = config.header.toLocaleLowerCase()
    let token = ctx.headers[authHeader];
    const loginRequired = ()=>{
      ctx.status = 401
    }

    if (
      !config.shouldSkip ||
      (config.shouldSkip && typeof config.shouldSkip === 'function' && !config.shouldSkip(ctx))
    ) {
        if (!token || !token.split(' ')[1]) {
          return loginRequired();
        }

        token = token.split(' ')[1]

        let jwtSession
        try {
          jwtSession = await ctx.jwtVerify(token)
        } catch (err) {
          // https://github.com/auth0/node-jsonwebtoken/blob/5ed1f061869b7d4e624a51789fd4a135ddb34b45/README.md
          if (err.name = 'JsonWebTokenError') {
            switch (err.message) {
              case 'jwt malformed':
                return loginRequired()
            }
          } else if (err.name === 'TokenExpiredError') return loginRequired()

          throw err
        }

        ctx[contextKey!] = jwtSession
    }

    await next();

    let payload = ctx[contextKey!]
    token = await ctx.jwtSign(payload, payload.exp ? undefined : {expiresIn: config.expiresIn})
    ctx.response.set(config.header, `Bearer ${token}`)
  };
};


function extendContext(ctx, opts: Config) {
  const {contextKey, key} = opts;

  if (ctx.hasOwnProperty(contextKey)) {
    ctx.app.logger.warn('egg-jwt: there already has a contextKey assosiated with this context')
    return;
  }

  function jwtSign(payload, options){
    return sign(payload, key, options)
  }

  function jwtVerify(token: string, options){
    return verify(token, key, options)
  }

  Object.defineProperties(ctx, {
    [contextKey!]: { 
      writable: true,
      value: {},
    },
    jwtSign: { 
      value: jwtSign
    },
    jwtVerify: { 
      value: jwtVerify
    }
  });
}
