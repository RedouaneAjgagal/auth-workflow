const { verifyToken } = require('../utils');
const { UnauthenticatedError } = require('../errors');
const Token = require('../models/Token');
const { attachCookies } = require('../utils')

const authenticateUser = async (req, res, next) => {
    const { accessToken, refreshToken } = req.signedCookies;
    try {
        if (accessToken) {
            const payload = verifyToken(accessToken);
            req.user = payload.userInfo;
            return next();
        }
        const payload = verifyToken(refreshToken);
        const token = await Token.findOne({
            user: payload.userInfo.id,
            refreshToken: payload.refreshToken
        });
        if (!token || !token?.isValid) {
            throw new UnauthenticatedError('Invalid authentication');
        }
        attachCookies(res, payload.userInfo, token.refreshToken);
        req.user = payload.userInfo;
        return next();
    } catch (error) {
        throw new UnauthenticatedError('Invalid authentication');
    }
}

module.exports = authenticateUser;