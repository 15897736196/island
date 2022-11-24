const Router = require('koa-router')
const router = new Router({
    prefix: '/v1/token'//当前router实例上的api都共有的前缀
})
const { TokenValidator, NotEmptyValidator } = require('../../validators/validator')
const { User } = require('@models/user')

// const { success } = require('../../lib/helper')
const { LoginType } = require('../../lib/enum')
const { generateToken } = require('../../../core/util')
const { Auth } = require('../../../middlewares/auth')
const { WXManager } = require('../../services/wx')
//
router.post('/', async (ctx) => {
    const v = new TokenValidator()
    await v.validate(ctx)

    let token
    switch (v.get('body.type')) {
        case LoginType.USER_EMAIL:
            token = await emailLogin(v.get('body.account'),v.get('body.secret'))
            break;
        case LoginType.USER_MINI_PROGRAM://小程序登录
            token = await WXManager.codeToToken(v.get('body.account'))
            break;
        case LoginType.ADMIN_EMAIL:
            
            break;
        default:
            throw new Error('没有相应的处理方法')
    }
    ctx.body = {
        token
    }

})
router.post('/verify',async (ctx)=>{
    const v = new NotEmptyValidator('token不能为空')
    await v.validate(ctx)

    const result = Auth.verifyToken(v.get('body.token'))
    ctx.body = {
        is_valid: result
    }
})
async function emailLogin(account,secret){
    const user = await User.verifyEmailPassword(account,secret)
    //我们将普通用户的scope设置为8管理员为16以此区分权限
    //这里我们默认把权限都设置为普通用户（8）
    return generateToken(user.id, Auth.USER)//返回token令牌
}
module.exports = router