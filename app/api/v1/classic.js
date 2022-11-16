const Router = require('koa-router')
const router = new Router()
const { HttpException, ParameterException } = require('../../../core/http-exception')

router.post('/v1/classic/latest/:id', (ctx, next) => {
  const query = ctx.request.query
  const param = ctx.params
  if (Object.keys(query).length == 0) {
    throw new HttpException('缺少了query参数啊', 1000, 400)
  }
  if (true) {
    throw new ParameterException('没有传param啊')
  }
  ctx.body = '恭喜你成功了'
  // throw new Error('api exception')
})

module.exports = router
