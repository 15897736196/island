class HttpException extends Error {
  constructor(msg = '服务器异常', errorCode = 10000, code = 400) {
    super()
    this.errorCode = errorCode
    this.code = code
    this.msg = msg
  }
}

class ParameterException extends HttpException {
  constructor(msg = '参数错误', errorCode = 10000) {
    super()
    this.code = 400
    this.msg = msg
    this.errorCode = errorCode
  }
}

class NotFound extends HttpException {
  constructor(msg = '信息未被找到', errorCode = 10004) {
    super()
    this.code = 404
    this.msg = msg
    this.errorCode = errorCode
  }
}
class Forbidden extends HttpException {
  constructor(msg = '禁止访问', errorCode = 10006, code) {
    super()
    this.code = code || 404
    this.msg = msg
    this.errorCode = errorCode
  }
}
class likeError extends HttpException {
  constructor(msg = '你已经进行点赞操作了', errorCode = 60002) {
    super()
    this.code = 400
    this.msg = msg
    this.errorCode = errorCode
  }
}

module.exports = {
  HttpException,
  ParameterException,
  NotFound,
  Forbidden,
  likeError
}
