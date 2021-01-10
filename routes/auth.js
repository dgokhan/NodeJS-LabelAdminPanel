const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();
  
// Routers  
router.post('/login', authController.login)
router.post('/register', authController.register)

module.exports = router;