
const { Sequelize, Model, Op } = require('sequelize')
const { sequelize } = require('../../core/db')
const { likeError, NotFound } = require('../../core/http-exception')
// const { Art } = require('@models/art')
// 循环导入Art为undefined，我们将模块导入放到局部导入

class Favor extends Model {
    static async like(art_id, type, uid) {
        //当用户喜欢一个期刊时，要往favor表中添加一条记录,同时要更改对应期刊的表的部分数据
        //这里涉及到一个问题，对两张表的操作，若其中一个操作失败则会导致数据的不一致，
        //!数据库事务，可以保证数据的一致性，要么全部成功要么全部失败
        const favor = await Favor.findOne({
            where: { art_id, type, uid }
        })
        if (favor) {
            throw new likeError('已经点过赞了')
        }

        try {
            //开始处理事务
            await sequelize.transaction(async t => {
                const { Art } = require('./art')
                await Favor.create({ art_id, type, uid }, { transaction: t })
                const art = await Art.getData(art_id, type)
                await art.increment('fav_nums', { by: 1, transaction: t })//increment对某个字段进行加n的操作
            })
        } catch (error) {
            console.log(error)
        }
    }
    static async dislike(art_id, type, uid) {
        //取消赞，先查询如果查询到了，则删除该记录
        const favor = await Favor.findOne({
            where: { art_id, type, uid }
        })
        if (!favor) {
            throw new likeError('您没有点赞过')
        }

        try {
            //开始处理事务
            await sequelize.transaction(async t => {
                //找到了该条记录，直接销毁
                //force为false时是软删除
                const { Art } = require('./art.js')
                await favor.destroy({ force: false, transaction: t })
                const art = await Art.getData(art_id, type)
                await art.decrement('fav_nums', { by: 1, transaction: t })//increment对某个字段进行加n的操作
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async userLikeIt(art_id, type, uid) {
        //用户是否点赞过某个期刊
        const favor = await Favor.findOne({
            where: { art_id, type, uid }
        })
        return favor ? true : false
    }

    static async getMyClassicFavors(uid) {
        const { Art } = require('@models/art')
        const arts = await Favor.findAll({
            where: {
                uid,
                type: {
                    [Op.not]: 400
                }
            }
        })
        if (!arts) {
            throw new NotFound('未找到期刊列表')
        }

        return await Art.getList(arts)
    }

    static async getBookFavor(uid, book_id) {
        const favorNums = await Favor.count({
            where: {
                art_id: book_id,
                type: 400
            }
        })
        const myFavor = await Favor.findOne({
            where: {
                art_id: book_id,
                uid,
                type: 400
            }
        })
        return {
            fav_nums: favorNums,
            like_status: myFavor ? 1 : 0 //如果myFavor能查到，那么说明我点赞过
        }
    }
}

//用于记录用户点赞内容的表
Favor.init({
    uid: Sequelize.INTEGER,//用户id
    art_id: Sequelize.INTEGER,//期刊id
    type: Sequelize.INTEGER//哪个类型的期刊
}, { sequelize, tableName: 'favor' })

module.exports = { Favor }