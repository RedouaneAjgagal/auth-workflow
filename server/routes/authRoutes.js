const express = require('express');
const { register, login, verifyEmail, logout } = require('../controllers/authController');
const authenticateUser = require('../middleware/authentication');
const router = express.Router();



router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.delete('/logout', authenticateUser, logout);


module.exports = router;