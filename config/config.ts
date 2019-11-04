import { Context } from 'egg';

export interface Config {
  key: string,
  header: string,
  algorithm?: string,
  expiresIn?: string,
  contextKey?: string,
  shouldSkip?: (ctx: Context)=> boolean
}
