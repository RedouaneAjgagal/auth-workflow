const sendVerificationEmail = require('./sendVerificationEmail');
const { attachCookies, destroyCookies, verifyToken } = require('./createToken');
const createUserInfo = require('./createUserInfo');
const sendResetPasswordEmail = require('./sendResetPasswordEmail');


module.exports = {
    sendVerificationEmail,
    attachCookies,
    createUserInfo,
    destroyCookies,
    verifyToken,
    sendResetPasswordEmail
}