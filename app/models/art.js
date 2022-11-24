// const { flatten } = require('lodash')
const { Op } = require('sequelize')
const { NotFound } = require('../../core/http-exception')
const { Movie, Sentence, Music } = require('./classic')
const { Favor } = require('./favor')
const { Flow } = require('./flow')

class Art {
    static async getList(artInfoList) {
        //in
        const artInfoObj = {
            100: [],
            200: [],
            300: []
        }
        artInfoList.forEach(val => {
            if (Object.keys(artInfoObj).includes(val.type+'')) {
                artInfoObj[val.type].push(val.art_id)
            }
        })
        const arts = []
        for (let key in artInfoObj) {
            const ids = artInfoObj[key]
            if (ids.length !== 0) {
                // arts.push(getListByType(ids, key))
                arts.push(...await getListByType(ids, key))
            }
        }
        return arts; //flatten(arts)

        async function getListByType(ids, type) {
            let arts = []
            const where = {
                id: {
                    [Op.in]: ids
                }
            }
            type = Number(type)
            switch (type) {
                case 100:
                    arts = await Movie.scope('scp').findAll({ where })
                    break
                case 200:
                    arts = await Music.scope('scp').findAll({ where })
                    break
                case 300:
                    arts = await Sentence.scope('scp').findAll({ where })
                    break
                case 400:
                    break
                default:
                    break
            }
            return arts
        }
    }
    //根据artid和type返回具体的art
    static async getData(art_id, type) {
        //type: 100表示音乐，200表示
        const where = {
            id: art_id
        }
        let art = null
        type = Number(type)
        switch (type) {
            case 100:
                art = await Movie.scope('scp').findOne({ where })
                break
            case 200:
                art = await Music.scope('scp').findOne({ where })
                break
            case 300:
                art = await Sentence.scope('scp').findOne({ where })
                break
            case 400:
                break
            default:
                break
        }
        return art
    }

    static async getArtDetailByIndex(index, ctx) {
        const flow = await Flow.findOne({
            where: {
                index
            }
        })
        if (!flow) {
            throw new NotFound('未找到期刊')
        }
        const art = await Art.getData(flow.art_id, flow.type)
        const likeOrNot = await Favor.userLikeIt(flow.art_id, flow.type, ctx.auth.uid)
        // art.dataValues.index = flow.index
        art.setDataValue('index', flow.index)
        art.setDataValue('like_status', likeOrNot)
        return art
    }

    static async getArtDetailById(art_id, type, ctx) {
        const art = await Art.getData(art_id, type)
        const likeOrNot = await Favor.userLikeIt(art_id, type, ctx.auth.uid)
        if (!art) {
            throw new NotFound('未找到期刊')
        }
        return {
            fav_nums: art.fav_nums,
            like_status: likeOrNot
        }
    }
}

module.exports = { Art }