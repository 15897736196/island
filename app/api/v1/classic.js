const Router = require('koa-router')
const router = new Router()
const { PositiveIntegerValidator } = require('../../validators/validator')

router.post('/v1/classic/latest/:id', async(ctx, next) => {
  // const param = ctx.params
  // const query = ctx.request.query
  // const body = ctx.request.body
  // const header = ctx.request.header
  // if (Object.keys(query).length == 0) {
  //   throw new global.errs.ParameterException()
  // }

  const v = new PositiveIntegerValidator()
  await v.validate(ctx)//如果这里是跑出的异常下面代码不会执行
  const id = v.get('path.id')

  ctx.body = '恭喜你成功了'
  // throw new Error('api exception')
})

module.exports = router
