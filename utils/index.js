const sendVerificationEmail = require('./sendVerificationEmail');
const { attachCookies, destroyCookies, verifyToken } = require('./createToken');
const createUserInfo = require('./createUserInfo');
const sendResetPasswordEmail = require('./sendResetPasswordEmail');
const createHash = require('./createHash')


module.exports = {
    sendVerificationEmail,
    attachCookies,
    createUserInfo,
    destroyCookies,
    verifyToken,
    sendResetPasswordEmail,
    createHash
}