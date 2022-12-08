const Router = require('koa-router');
const { Auth } = require('../../../middlewares/auth');
const { Book } = require('../../models/book');
const { Favor } = require('../../models/favor');
const { HotBook } = require('../../models/hot-book');
const { Comment } = require('../../models/book-comment');
const { PositiveIntegerValidator, SearchValidator, AddShortCommentValidator } = require('../../validators/validator');
const router = new Router({
  prefix: '/v1/book'
});

router.get('/hot_list', new Auth(8).m, async ctx => {
  const hotBooks = await HotBook.getAll()
  ctx.body = hotBooks
})

router.get('/:id/detail', new Auth(8).m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx)
  const id = v.get('path.id')
  const book = new Book()
  ctx.body = await book.detail(id)
})
//模糊搜索
router.get('/search', new Auth(8).m, async ctx => {
  const v = await new SearchValidator().validate(ctx)
  const q = v.get('query.q')
  const start = v.get('query.start')
  const count = v.get('query.count')
  const bookMsg = await Book.searchFromYuShu(q, start, count)
  ctx.body = bookMsg
})

//获取我喜欢的书籍的数量
router.get('/favor/count', new Auth(8).m, async ctx => {
  const count = await Book.getMyFavorBookCount(ctx.auth.uid)
  ctx.body = {
    count
  }
})

//获取每一本书籍的点赞情况
router.get('/:book_id/favor', new Auth(8).m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, { id: 'book_id' })
  const book_id = v.get('path.book_id')
  const favorMsg = await Favor.getBookFavor(ctx.auth.uid, book_id)
  ctx.body = favorMsg
})

//新增短评
router.post('/add/short_comment', new Auth(8).m, async ctx => {
  const v = await new AddShortCommentValidator().validate(ctx, { id: 'book_id' })
  const book_id = v.get('body.book_id')
  const content = v.get('body.content')
  await Comment.addComment(book_id, content)
  ctx.body = {
    code: 200,
    message: '评论成功'
  }
})

//获取短评
router.get('/:book_id/short_comment', new Auth(8).m, async ctx => {
  const v = await new PositiveIntegerValidator().validate(ctx, { id: 'book_id' })
  const book_id = v.get('path.book_id')
  const comments = await Comment.getComment(book_id)
  ctx.body = {
    comments,
    book_id
  }
})

router.get('/hot_keyword', new Auth(8).m, async ctx =>{
  ctx.body = {
    hot: ['Python','哈利·波特','东野圭吾','白夜行','韩寒','金庸','王小波']
  }
})

module.exports = router;
