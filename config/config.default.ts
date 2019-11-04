import { Config } from './config';

export const jwt: Config = {
  contextKey: 'session',
  key: 'egg-jwt',
  expiresIn: '1d',
  header: 'Authorization'
}