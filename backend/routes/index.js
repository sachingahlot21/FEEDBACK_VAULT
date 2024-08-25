const express = require('express')
const { jwtAuthMiddleware } = require('../jwt')
const{handleUserSignup,handleUserLogin, verifyEmail,acceptMessage,sendMessage, getAllMessage,suggestQuestions}= require('../controllers/index')

const router = express.Router();

router.post('/signup' , handleUserSignup)
router.post('/signin' , handleUserLogin)
router.get('/verify-email' , verifyEmail)
router.post('/accept-message' ,jwtAuthMiddleware, acceptMessage)
router.post('/send-message' , sendMessage)
router.get('/questions' , suggestQuestions)
router.get('/messages' , getAllMessage)

module.exports = router