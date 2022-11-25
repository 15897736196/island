
const { Sequelize, Model } = require('sequelize')
const { sequelize } = require('../../core/db')

const commonFiled = {
    image: {
        type: Sequelize.STRING,
    },
    content: Sequelize.STRING,
    pubdate: Sequelize.DATEONLY,
    fav_nums:{
        type:  Sequelize.INTEGER,
        defaultValue: 0
    },
    title: Sequelize.STRING,
    type: Sequelize.TINYINT
}

class Movie extends Model {

}
Movie.init(commonFiled, { sequelize, tableName: 'movie' })//tableName可以指定表名


class Sentence extends Model {

}
Sentence.init(commonFiled, { sequelize, tableName: 'sentence' })//tableName可以指定表名

class Music extends Model {

}
const musicField = Object.assign({ url: Sequelize.STRING }, commonFiled)
Music.init(musicField, { sequelize, tableName: 'music' })//tableName可以指定表名

module.exports = { Movie, Music, Sentence }