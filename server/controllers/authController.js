const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const register = async (req, res) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        throw new BadRequestError('Must provide all values');
    }
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        throw new BadRequestError('Email already exist, Please choose another one!');
    }
    const verificationToken = 'fake token'
    const user = await User.create({ userName, email, password, verificationToken });
    // Send verificationToken token back only while testing
    res.status(StatusCodes.CREATED).json({
        msg: 'Success! Please check your email to verify your account',
        verificationToken: user.verificationToken
    });
}


module.exports = {
    register
}