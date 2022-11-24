function isThisType(val) {
    if(typeof val === 'string'){
        val = Number(val)
    }
    for (let key in this) {
        if (this[key] === val) {
            return true
        }
    }
    return false
}
const LoginType = {
    USER_MINI_PROGRAM: 100,
    USER_EMAIL: 101,
    USER_MOBILE: 102,
    ADMIN_EMAIL: 200,
    isThisType
}

const ArtType = {
    Movie: 100,
    Musice: 200,
    Sentence: 300,
    Book: 400,
    isThisType
}

module.exports = {
    LoginType,
    ArtType
}