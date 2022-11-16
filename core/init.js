const Router = require('koa-router')
const requireDirectory = require('require-directory')
class InitManger {
  static initCore(app) {
    //入口方法
    this.app = app
    this.initLoadRouters()
  }
  static initLoadRouters() {
    const apiDirectory = `${process.cwd()}/app/api`
    let whenLoadModule = obj => {
      if (obj instanceof Router) {
        this.app.use(obj.routes())
      }
    }
    requireDirectory(module, apiDirectory, { visit: whenLoadModule })
  }
}

module.exports = InitManger
