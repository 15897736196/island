

const { LinValidator, Rule } = require("../../core/lin-validator");
const { User } = require("../models/user");

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

module.exports = { PositiveIntegerValidator, RegisterValidator }