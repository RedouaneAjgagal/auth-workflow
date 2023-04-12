const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const crypto = require('crypto');
const { sendVerificationEmail, attachCookies, createUserInfo } = require('../utils');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        throw new BadRequestError('Must provide all values');
    }
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        throw new BadRequestError('Email already exist, Please choose another one!');
    }
    const verificationToken = crypto.randomBytes(40).toString('hex');
    const user = await User.create({ name, email, password, verificationToken });
    const origin = 'http://localhost:3000';
    await sendVerificationEmail({
        name: user.name,
        email: user.email,
        verificationToken: user.verificationToken,
        origin
    });
    const userInfo = createUserInfo(user);
    // attachCookies(res, userInfo);
    res.status(StatusCodes.CREATED).json({
        msg: 'Success! Please check your email to verify your account'
    });
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Must provide email and password');
    }
    const user = await User.findOne({ email });
    if (!user) {
        throw new UnauthenticatedError('Invalid email or password');
    }
    const isCorrectPassword = await user.comparePassword(password);
    if (!isCorrectPassword) {
        throw new UnauthenticatedError('Invalid email or password');
    }
    if (!user.isVerified) {
        throw new UnauthenticatedError('Please verify your email');
    }
    const userInfo = createUserInfo(user);

    let refreshToken = crypto.randomBytes(40).toString('hex');
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const userToken = { ip, userAgent, refreshToken, user: user._id }
    await Token.create(userToken);

    attachCookies(res, userInfo, refreshToken);
    res.status(StatusCodes.OK).json({ user: { userId: userInfo.id, name: userInfo.name, role: userInfo.role } });
}

const verifyEmail = async (req, res) => {
    const { verificationToken, email } = req.body;
    const user = await User.findOne({ email });
    if (user?.isVerified) {
        return res.status(StatusCodes.OK).json({ msg: 'Already verified' });
    }
    if (!user) {
        throw new UnauthenticatedError('Verification failed');
    }
    if (verificationToken !== user.verificationToken) {
        throw new UnauthenticatedError('Verification failed');
    }
    user.isVerified = true;
    user.verificationToken = '';
    user.verified = Date.now();
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Email is verified now' });
}

module.exports = {
    register,
    login,
    verifyEmail
}