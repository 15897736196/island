const { HttpException } = require("../core/http-exception")

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err instanceof HttpException) {
      ctx.body = {
        msg: err.msg,
        errorCode: err.errorCode,
        requestUrl: `${ctx.method} ${ctx.path}`
      }
      ctx.status = err.code
    }
    // ctx.body = '你的服务器有点问题'
  }
}

module.exports = catchError
