

const { LinValidator, Rule } = require("../../core/lin-validator");
const { User } = require("../models/user");
const { LoginType, ArtType } = require('../lib/enum')

class PositiveIntegerValidator extends LinValidator {
  constructor() {
    super();
    this.id = [new Rule("isInt", "需要是正整数", { min: 1 })];
  }
}
class RegisterValidator extends LinValidator {
  constructor() {
    super();
    this.email = [new Rule("isEmail", "不符合Email规范")];
    this.password1 = [
      // new Rule("isLength", "密码至少6个字符，最多32个字符", { min: 6, max: 12 }),
      new Rule("matches", "密码至少6个字符，最多32个字符,禁止使用特殊字符", '^[a-zA-Z0-9_-]{4,16}$')
    ];
    this.password2 = this.password1
    this.nickname = new Rule("isLength", "昵称不符合长度规范", { min: 3, max: 16 })
  }
  validatePassword(vals) {
    const pswd1 = vals.body.password1
    const pswd2 = vals.body.password2
    if (pswd1 !== pswd2) {
      throw new Error('两个密码必须相同')
    }
  }
  async validateEmail(vals) {
    const email = vals.body.email
    const user = await User.findOne({
      where: { email }
    })
    if (user) { throw new Error('该邮箱已被使用') }
  }
}
class TokenValidator extends LinValidator {
  constructor() {
    super();
    this.account = [new Rule('isLength', '不符合账号规则', { min: 4, max: 32 })]
    this.secret = [
      new Rule("isOptional"),
      new Rule('isLength', '不符合账号规则', { min: 4, max: 32 })
    ]
  }
  validateLoginType(vals) {
    if (!LoginType.isThisType(vals.body.type)) {
      throw new Error('type参数不合法')
    }
  }
}

class NotEmptyValidator extends LinValidator {
  constructor(msg = '不允许为空') {
    super()
    this.token = [new Rule('isLength', msg, { min: 1 })]
  }
}
//检查登录的类型


class Checker {
  constructor(type) {
    this.checker = type
  }

  check = (vals)=> {
    let type = vals.body.type || vals.path.type
    if (!type) {
      throw new Error('type是必须参数')
    }
    type = parseInt(type)
    if (!this.checker.isThisType(type)) {
      throw new Error('type参数不合法')
    }
  }
}

class LikeValidator extends LinValidator {
  constructor() {
    super()
    this.art_id = [new Rule("isInt", "需要是正整数", { min: 1 })];
    const checker = new Checker(ArtType)//type有两种，这里表示要校验是期刊的type
    this.validateType = checker.check
  }
}
class ClassicValidator extends LikeValidator {

}

module.exports = {
  PositiveIntegerValidator,
  RegisterValidator,
  TokenValidator,
  NotEmptyValidator,
  LikeValidator,
  ClassicValidator
}