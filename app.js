const Koa = require('koa')
const parser = require('koa-bodyparser')
const InitManger = require('./core/init')
const catchError = require('./middlewares/exception')

const app = new Koa()

app.use(catchError)//切面捕获异常，参考洋葱模型 
app.use(parser()) //用于获取http的body参数
//requireDirectory库直接导入了该目录下所有暴露出来的模块
InitManger.initCore(app)//注册路由中间件

app.listen(3000)
