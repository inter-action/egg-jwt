
import { Application } from 'egg';

module.exports = function(app: Application) {
  app.config.coreMiddleware.push('jwt')
}