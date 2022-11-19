const { HttpException } = require("../core/http-exception")

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    // if(global.config.env === 'dev'){ throw err }else{ console.log}
    const isHttpException = err instanceof HttpException
    const isDev = process.env.ENV === 'dev'
    if (!isDev && isHttpException) { throw err }
    if (isHttpException) {
      ctx.body = {
        msg: err.msg,
        errorCode: err.errorCode,
        requestUrl: `${ctx.method} ${ctx.path}`,
      }
      ctx.status = err.code
    } else {
      ctx.body = {
        msg: 'we made mistake (X.X)~',
        errorCode: 999,
        requestUrl: `${ctx.method} ${ctx.path}`
      }
      ctx.status = 500
    }
  }
}

module.exports = catchError
