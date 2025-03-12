const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/authController');

router.post('/logout',logout);
router.post('/login',login);
router.post('/signup',signup);

module.exports = router