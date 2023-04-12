const jwt = require('jsonwebtoken');
const createUserInfo = require('./createUserInfo');

const createToken = (payload) => {
    const userInfo = createUserInfo(payload);
    const token = jwt.sign(userInfo, process.env.JWT_SECRET);
    return token;
}

const verifyToken = (token) => {
    const isValidtoken = jwt.verify(token, process.env.JWT_SECRET);
    return isValidtoken
}

const attachCookies = (res, payload, refreshToken) => {
    const accessTokenJWT = createToken(payload);
    const refreshTokenJWT = createToken({ payload, refreshToken })

    res.cookie('accessToken', accessTokenJWT, {
        maxAge: 1000,
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === 'production'
    });
    
    const expiresIn = 14 * 24 * 60 * 60 * 1000 // 14 Days
    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + expiresIn)
    })
}

const destroyCookies = (res) => {
    res.cookie('token', 'logout', {
        expires: new Date(Date.now()),
        httpOnly: true
    });
}

module.exports = {
    verifyToken,
    attachCookies,
    destroyCookies
}