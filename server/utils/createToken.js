const jwt = require('jsonwebtoken');
const createUserInfo = require('./createUserInfo');

const createToken = (payload) => {
    const userInfo = createUserInfo(payload);
    const token = jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '2h' });
    return token;
}

const verifyToken = (token) => {
    const isValidtoken = jwt.verify(token, process.env.JWT_SECRET);
    return isValidtoken
}

const attachCookies = (res, payload) => {
    const token = createToken(payload);
    const expiresIn = 2 * 60 * 60 * 1000; // 2h
    res.cookie('token', token, {
        expires: new Date(Date.now() + expiresIn),
        httpOnly: true,
        signed: true,
        secure: process.env.NODE_ENV === 'production'
    });
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