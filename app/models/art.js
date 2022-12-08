// const { flatten } = require('lodash')
const { Op } = require('sequelize')
const { NotFound } = require('../../core/http-exception')
const { Movie, Sentence, Music } = require('./classic')
const { Favor } = require('./favor')
const { Flow } = require('./flow')
// const { HotBook } = require('./hot-book')

class Art {
    static async getList(artInfoList) {
        //in
        const artInfoObj = {
            100: [],
            200: [],
            300: []
        }
        artInfoList.forEach(val => {
            if (Object.keys(artInfoObj).includes(val.type + '')) {
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
                const { Book } = require('./book')
                art = await Book.scope('scp').findOne({ where })
                if(!art){
                    art = await Book.create({
                        id: art_id,
                    })  
                }
                break
            default:
                break
        }
        //在源头上保证图片返回的地址是一个完整的url来访问服务器的静态资源
        //如 http://localhost:3000/images/movie.8.png
        //关于静态资源，可以放置在本服务目录下，
        //也可以专门使用另一台服务器来专门管理存储静态资源 微服务 需要带宽足够
        //或者使用云服务， oss 贵 esc rds oss
        //或是使用 github gitpage 但只有300mb
        // if(art && art.image){
        //     let imgUrl = art.dataValues.image
        //     art.dataValues.image = process.env.HOST + imgUrl
        // }
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
        art.setDataValue('like_status',likeOrNot)
        return art
        // return {
        //     ...art.dataValues,//!不能直接这样做，这样会导致我们设置的序列化方法无法格式化图片路径！
        //     fav_nums: art.fav_nums,
        //     like_status: likeOrNot,
        // }
    }
}

module.exports = { Art }