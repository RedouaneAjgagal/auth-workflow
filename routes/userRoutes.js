const express = require('express');
const router = express.Router();
const { currentUser } = require('../controllers/userController');
const authenticateUser = require('../middleware/authentication');

router.get('/showMe', authenticateUser, currentUser);


module.exports = router;