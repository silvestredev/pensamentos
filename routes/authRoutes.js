const express = require('express');
const authController = require('../controller/authController');
const router = express.Router();

const ToughtController = require('../controller/ToughtController');

router.get('/login', authController.login)
router.post('/login', authController.loginPost)
router.get('/register', authController.register)
router.post('/register', authController.registerPost)
router.get('/logout', authController.logout)


module.exports = router;