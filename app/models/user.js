
const bcrypt = require('bcryptjs')
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const { NotFound } = require('../../core/http-exception')

class User extends Model {
    static async verifyEmailPassword(email, plainPassword) {
        const user = await this.findOne({
            where: {
                email
            }
        })
        if (!user) { throw new NotFound('用户不存在') }
        //如果用户存在，通过该用户的解密后的密码来对比是否正确
        const correct = bcrypt.compareSync(plainPassword, user.password)
        if (!correct) { throw new NotFound('密码错误') }
        return user
    }

    static async getUserByOpenid(openid){
        const user = await this.findOne({
            where:{ openid }
        })
        return user
    }

    static async registerByOpenid(openid){
        //小程序登录后记录用户的openid
        const user = await this.create({
            openid
        })
        return user
    }
}

User.init({ 
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nickname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING(128),
        unique: true,
    },
    password: {
        //观察者模式
        type: Sequelize.STRING,
        //使用bcryptjs对用户密码进行加密
        set(val) {
            const salt = bcrypt.genSaltSync(10)
            const psw = bcrypt.hashSync(val, salt)
            this.setDataValue('password', psw)
        }
    },
    openid: {
        type: Sequelize.STRING(64),
        unique: true,
    },
}, { sequelize, tableName: 'user' })//tableName可以指定表名

module.exports = { User }