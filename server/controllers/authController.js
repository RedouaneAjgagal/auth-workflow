const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const crypto = require('crypto');

const register = async (req, res) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        throw new BadRequestError('Must provide all values');
    }
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        throw new BadRequestError('Email already exist, Please choose another one!');
    }
    const verificationToken = crypto.randomBytes(40).toString('hex');
    const user = await User.create({ userName, email, password, verificationToken });
    // Send verificationToken token back only while testing
    res.status(StatusCodes.CREATED).json({
        msg: 'Success! Please check your email to verify your account',
        verificationToken: user.verificationToken
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
    res.status(StatusCodes.OK).json({ msg: 'login successfully' });
}



module.exports = {
    register,
    login,
    
}