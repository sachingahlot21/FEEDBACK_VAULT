const express = require('express')
const{handleUserSignup, verifyEmail}= require('../controllers/index')

const router = express.Router();

router.post('/signup' , handleUserSignup)
router.get('/verify-email' , verifyEmail)

module.exports = router