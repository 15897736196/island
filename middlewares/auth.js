const basicAuth = require('basic-auth')
const { Forbidden } = require('../core/http-exception')
const jwt = require('jsonwebtoken')
//关于用户权限的中间件
class Auth {
    constructor(level) {
        this.level = level || 8
        //权限管理      
        Auth.USER = 8
        Auth.ADMIN = 16
        Auth.SUPER_AMIN = 32
    }

    get m(){
        return async (ctx, next)=>{
            //token检测
            //此处和前端约定在http的basicauth的! name 中传递token
            const userToken = basicAuth(ctx.req)//ctx.req是nodejs原生的request对象
            if(!userToken || !userToken.name){
                throw new Forbidden('令牌过期','',403)
            }
            try{
                var decode = jwt.verify(userToken.name,process.env.SECRETKEY)
            }catch(err){
                // 1，token不合法 2，token合法但过期
                if(err.name == 'TokenExpiredError'){
                    throw new Forbidden('token令牌已过期')
                }
                throw new Forbidden('令牌不合法')
            }
            //用户的权限等级小于某个接口定义的权限等级则禁止访问
            if(decode.scope < this.level){
                throw new Forbidden('没有权限')
            }
            //将该次请求的token中的uid和scoped存入上下文中
            ctx.auth = {
                //这里的uid是使用的数据库自动生成的自增id（ 调用generateToken时传入
                uid: decode.uid,
                scope: decode.scope
            }
            await next()
        }
    }

    static verifyToken(token){
        try {
            jwt.verify(token,process.env.SECRETKEY)
            return true
        } catch (error) {
            return false
        }
    }

}
module.exports = { Auth }