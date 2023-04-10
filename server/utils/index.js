const sendVerificationEmail = require('./sendVerificationEmail');
const { attachCookies, destroyCookies, verifyToken } = require('./createToken');
const createUserInfo = require('./createUserInfo');


module.exports = {
    sendVerificationEmail,
    attachCookies,
    createUserInfo,
    destroyCookies,
    verifyToken
}