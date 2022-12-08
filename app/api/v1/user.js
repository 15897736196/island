const Router = require('koa-router')
const router = new Router({
    prefix: '/v1/user'//当前router实例上的api都共有的前缀
})
const { RegisterValidator } = require('../../validators/validator')
const { User } = require('@models/user')
//接受参数？
router.post('/register', async (ctx) => {
    const v = new RegisterValidator()
    await v.validate(ctx)

    const user = {
        email: v.get('body.email'),
        password: v.get('body.password2'),
        nickname: v.get('body.nickname'),
    }

    await User.create(user)
    ctx.body= {
        msg: '创建用户成功',
        code: 200
    }
})

module.exports = router