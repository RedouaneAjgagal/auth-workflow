const express = require('express');
const { register, login, verifyEmail, logout, forgotPassword, resetPassword } = require('../controllers/authController');
const authenticateUser = require('../middleware/authentication');
const router = express.Router();



router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.delete('/logout', authenticateUser, logout);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);


module.exports = router;