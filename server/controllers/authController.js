const User = require('../models/User');
const Token = require('../models/Token');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const crypto = require('crypto');
const { sendVerificationEmail, attachCookies, createUserInfo, destroyCookies, sendResetPasswordEmail, createHash } = require('../utils');
const assert = require('assert');

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
    const origin = 'https://auth-workflow-a45b.onrender.com';
    await sendVerificationEmail({
        name: user.name,
        email: user.email,
        verificationToken: user.verificationToken,
        origin
    });
    const userInfo = createUserInfo(user);
    attachCookies(res, userInfo);
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

    const token = await Token.findOne({ user: user._id });
    if (token) {
        if (!token.isValid) {
            throw new UnauthenticatedError('Unauthenticated action');
        }
        refreshToken = token.refreshToken;
        attachCookies(res, userInfo, refreshToken);
        return res.status(StatusCodes.OK).json({ user: { userId: userInfo.id, name: userInfo.name, role: userInfo.role } });
    }

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

const logout = async (req, res) => {
    await Token.findOneAndDelete({ user: req.user.id });
    destroyCookies(res, 'accessToken');
    destroyCookies(res, 'refreshToken');
    res.status(StatusCodes.OK).json({ msg: 'Logged out' });
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    if (!validEmail) {
        throw new BadRequestError('Must provide a valid email')
    }
    const user = await User.findOne({ email });
    if (user) {
        const passwordToken = crypto.randomBytes(70).toString('hex');
        const expiresIn = 15 * 60 * 1000 // 15 mins
        const passwordTokenExpirationDate = new Date(Date.now() + expiresIn);
        user.passwordToken = createHash(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate;
        await user.save();
        // Send the email        
        const origin = 'https://auth-workflow-a45b.onrender.com';
        sendResetPasswordEmail({ name: user.name, email: user.email, origin, token: passwordToken });
    }
    res.status(StatusCodes.OK).json({ msg: 'Please check your email to reset password' });
}

const resetPassword = async (req, res) => {
    const { email, password, token } = req.body
    const validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
    if (!validEmail || (!password || password.length < 6 || password.length > 60) || !token) {
        throw new BadRequestError('Invalid values');
    }
    const hashedToken = createHash(token);
    const user = await User.findOne({ email, passwordToken: hashedToken });
    if (user) {
        const currentTime = new Date();
        if (user.passwordTokenExpirationDate > currentTime) {
            user.password = password;
            user.passwordToken = null;
            user.passwordTokenExpirationDate = null;
            await user.save();
        }
    }
    res.status(StatusCodes.OK).json({ msg: 'Reset password successfully!' });
}

module.exports = {
    register,
    login,
    verifyEmail,
    logout,
    forgotPassword,
    resetPassword
}