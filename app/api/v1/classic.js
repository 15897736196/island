const Router = require('koa-router')
const router = new Router({
  prefix: '/v1/classic'
})
const { Auth } = require('../../../middlewares/auth')
const userLevel = require('../../lib/userLevel')
const { Flow } = require('@models/flow')
const { Art } = require('@models/art')
const { Favor } = require('@models/favor')
const { PositiveIntegerValidator, ClassicValidator } = require('../../validators/validator')
const { NotFound } = require('../../../core/http-exception')

router.get('/latest', new Auth(userLevel.ordinary_user).m, async (ctx, next) => {
  // const param = ctx.params
  // const query = ctx.request.query
  // const body = ctx.request.body
  // const header = ctx.request.header
  let flow

  try {
    flow = await Flow.findOne({
      //order让整个数据表按照index以倒序来排序
      order: [
        ['index', 'DESC']
      ]
    })
  } catch (error) {
    console.log('最新期刊查询错误', error)
  }

  const art = await Art.getData(flow.art_id, flow.type)
  const likeOrNot = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
  // art.dataValues.index = flow.index
  art.setDataValue('index', flow.index)
  art.setDataValue('like_status', likeOrNot)
  //* index在flow模型中表示期刊的次序，这里因为模型的序列化故用这种方式将index参数返回 */
  ctx.body = art

})
//查询下一期刊
router.get('/:index/next', new Auth(8).m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, { id: 'index' })
  const msg = await Art.getArtDetailByIndex(v.get('path.index') + 1, ctx)
  ctx.body = msg
})

//查询上一期刊
router.get('/:index/previous', new Auth(8).m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, { id: 'index' })
  const msg = await Art.getArtDetailByIndex(v.get('path.index') - 1, ctx)
  ctx.body = msg
})

//查询某一期刊的点赞数量和用户是否点赞过
router.get('/:type/:id/favor', new Auth(8).m, async ctx => {
  const v = await new ClassicValidator().validate(ctx, { art_id: 'id' })
  const id = v.get('path.id')
  const type = v.get('path.type')

  const msg = await Art.getArtDetailById(id, type, ctx)
  ctx.body = msg
})

//查询某一期刊的点赞数量和用户是否点赞过
router.get('/favor', new Auth(8).m, async ctx => {
  const uid = ctx.auth.uid
  const msg = await Favor.getMyClassicFavors(uid)
  ctx.body = msg
})

module.exports = router
