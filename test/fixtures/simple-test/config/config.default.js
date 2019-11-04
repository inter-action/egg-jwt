exports.keys = 'keys';

exports.jwt = {
  shouldSkip(ctx) {
    if (ctx.query.authToken) {
      return true
    }
  }
}