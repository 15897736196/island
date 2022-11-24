const axios = require('axios')
const { NotFound } = require('../../core/http-exception')
const { generateToken } = require('../../core/util')
const { Auth } = require('../../middlewares/auth')
const { User } = require('../models/user')

class WXManager {
    static async codeToToken(js_code) {
        //关于小程序必须知道，调用小程序的服务需要三个参数
        // 用户code，小程序的appid以及appsecret
        const url = 'https://api.weixin.qq.com/sns/jscode2session'
        let params = {
            appid: process.env.APPID,
            secret: process.env.APPSECRET,
            js_code,
            grant_type: 'authorization_code'
        }
        const { status, data:{openid, errcode, errmsg} } =
            await axios.get(url, {params})
        // 返回数据示例
        // {
        //     "openid":"xxxxxx",
        //     "session_key":"xxxxx",
        //     "unionid":"xxxxx",
        //     "errcode":0,
        //     "errmsg":"xxxxx"
        // }
        if (status !== 200) {
            throw new NotFound('openid获取失败')
        }
        if (errcode) {
            throw new NotFound('openid获取失败' + errmsg)
        }

        const user = await User.getUserByOpenid(openid)
        //根据openid查询用户是否存在
        // 如果不存在则说明是第一次登录使用我们的小程序，需要为他创建一条用户数据
        if (!user) {
            user = await User.registerByOpenid(openid)
        }
        //最后返回token给客户端
        return generateToken(user.id, Auth.USER)
    }
}

module.exports = { WXManager }