const jwt = require('jsonwebtoken');
const createUserInfo = require('./createUserInfo');

const createToken = ({ payload, refreshToken }) => {
    const userInfo = createUserInfo(payload);
    const signToken = {
        userInfo
    }
    if (refreshToken) {
        signToken.refreshToken = refreshToken;
    }
    const token = jwt.sign(signToken, process.env.JWT_SECRET);
    return token;
}

const verifyToken = (token) => {
    const isValidtoken = jwt.verify(token, process.env.JWT_SECRET);
    return isValidtoken
}

const attachCookies = (res, payload, refreshToken) => {
    const accessTokenJWT = createToken({ payload });
    const refreshTokenJWT = createToken({ payload, refreshToken });

    const accessTokenExpires = 2 * 60 * 60 * 1000 // 2 Hours
    res.cookie('accessToken', accessTokenJWT, {
        expires: new Date(Date.now() + accessTokenExpires),
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    const refreshTokenExpires = 14 * 24 * 60 * 60 * 1000 // 14 Days
    res.cookie('refreshToken', refreshTokenJWT, {
        expires: new Date(Date.now() + refreshTokenExpires),
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
}

const destroyCookies = (res, token) => {
    res.cookie(token, 'logout', {
        expires: new Date(Date.now()),
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
}

module.exports = {
    verifyToken,
    attachCookies,
    destroyCookies
}