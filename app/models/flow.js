
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

class Flow extends Model {

}

Flow.init({
    index: Sequelize.INTEGER,
    art_id: Sequelize.INTEGER,
    type: Sequelize.INTEGER,
    //type可以帮助我们细分表，找到对应表后用artid查询，index表示第几期刊
}, { sequelize, tableName: 'flow' })

module.exports = { Flow }