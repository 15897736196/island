const Router = require('koa-router')
const { Auth } = require('../../../middlewares/auth')
const { LikeValidator } = require('../../validators/validator')
const { Favor } = require('@models/favor')
const router = new Router({
    prefix: '/v1/like'//当前router实例上的api都共有的前缀
})

router.post('/',new Auth(8).m,async ctx=>{
    const v =  new LikeValidator()
    await v.validate(ctx)

    await Favor.like(v.get('body.art_id'),v.get('body.type'),ctx.auth.uid)
    ctx.body = {
        msg: '点赞成功',
        code: 200
    }
})

router.post('/cancel',new Auth(8).m,async ctx=>{
    const v =  new LikeValidator()
    await v.validate(ctx)

    await Favor.dislike(v.get('body.art_id'),v.get('body.type'),ctx.auth.uid)
    ctx.body = {
        msg: '已取消点赞',
        code: 200
    }
})

module.exports = router