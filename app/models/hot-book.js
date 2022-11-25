
const { Op } = require('sequelize')
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const { Favor } = require('./favor')
//图书的概要信息
class HotBook extends Model {
    static async getAll(){
        const books = await HotBook.findAll({
            order:['index']
        })
        const ids = []
        //注意foreach中不能使用await
        books.forEach(val=>{
            ids.push(val.id)
        })
        //此处亦可以使用findAndCountAll，详情查看文档
        const favors = await Favor.findAll({
            where:{
                art_id: {
                    [Op.in]: ids,
                },
                type: 400
            },
            group: ['art_id'],//分组查询
            attributes: ['art_id', [Sequelize.fn('COUNT','*'),'count']]
        })
        const result = this._getEachBookStatus(books,favors)
        return result
    }

    static _getEachBookStatus(books, favors){
        favors.forEach((val)=>{
            const record = books.find(v=>v.id === val.art_id)
            record.dataValues.fav_nums = val.dataValues.count
        })
        books.forEach(val=>{
            if(!val.dataValues.fav_nums){
                val.setDataValue('fav_nums',0)
            }
        })
        return books
    }

}

HotBook.init({
    index: Sequelize.STRING,//index用来做排序
    image: Sequelize.STRING,
    author: Sequelize.STRING,
    title: Sequelize.STRING
}, { sequelize, tableName: 'hot_book' })

module.exports = { HotBook }