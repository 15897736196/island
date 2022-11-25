
const axios = require('axios')
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')
const util = require('util')
const { Favor } = require('./favor')

class Book extends Model {

    detail = async (id) => {
        const url = util.format(process.env.BOOK_DETAIL_URL, id)
        // const url = process.env.BOOK_DETAIL_URL
        // const params = { id: this.id }
        const { data } = await axios.get(url)
        return data
    }

    static async searchFromYuShu(q, start, count, summary = 1) {
        const url = util.format(process.env.BOOK_KEYWORD_URL, encodeURI(q), count, start, summary)
        const { data } = await axios.get(url)
        return data
    }

    static async getMyFavorBookCount(uid) {
        //count只求数量
        const count = await Favor.count({
            where:{
                type: 400,
                uid
            }
        })
        return count
    }

}

Book.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    fav_nums: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
}, { sequelize, tableName: 'book' })

module.exports = { Book }