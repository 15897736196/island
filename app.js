require('module-alias/register')
const Koa = require('koa')
const parser = require('koa-bodyparser')
const InitManger = require('./core/init')
const catchError = require('./middlewares/exception')
const dotenv = require('dotenv')//env
dotenv.config('./env')
const app = new Koa()

// require('./app/models/user')

// console.log('这是数据库环境变量',process.env.DATABASE_URL);

app.use(catchError)//切面捕获异常，参考洋葱模型 
app.use(parser()) //用于获取http的body参数
//requireDirectory库直接导入了该目录下所有暴露出来的模块
InitManger.initCore(app)//注册路由中间件

app.listen(3000)
