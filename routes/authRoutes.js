const express = require('express');
const { register, login, verifyEmail, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const authenticateUser = require('../middleware/authentication');
const router = express.Router();
const { accountLimiter, resetPasswordLimit } = require('../utils/rateLimit');



router.post('/register', accountLimiter, register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.delete('/logout', authenticateUser, logout);
router.post('/forgot-password', resetPasswordLimit, forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;