const express = require('express')
const { jwtAuthMiddleware } = require('../jwt')
const{addNotes,getAllNotes,handleUserSignup,handleUserLogin,getAcceptMessage ,verifyEmail,acceptMessage,sendMessage, getAllMessage,suggestQuestions,handleDeleteMessage}= require('../controllers/index')

const router = express.Router();

router.post('/signup' , handleUserSignup)
router.post('/signin' , handleUserLogin)
router.get('/verify-email' , verifyEmail)
router.post('/accept-message' ,acceptMessage)
router.post('/send-message' , sendMessage)
router.post('/add-note' , addNotes)
router.get('/questions' , suggestQuestions)
router.post('/messages' , getAllMessage)
router.post('/all-notes' , getAllNotes)
router.post('/get-accept-message' , getAcceptMessage)
router.delete('/:userId/delete_message/:messageId', handleDeleteMessage)

module.exports = router