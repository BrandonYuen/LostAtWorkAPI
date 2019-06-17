const express = require('express')
const router = express.Router()
const userController = require('./controllers/user-controller')
const diaryController = require('./controllers/diary-controller')
const chatController = require('./controllers/chat-controller')
const passport = require('passport')

router.get('/', (req, res) => {
  return res.send('Hello, this is the API');
})

// Users (authentication)
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

// Diary
router.get('/diary', passport.authenticate('jwt', { session: false }), diaryController.getAllEntriesByUserId)
router.get('/diary/:entryId', passport.authenticate('jwt', { session: false }), diaryController.getEntryById)
router.delete('/diary/:entryId', passport.authenticate('jwt', { session: false }), diaryController.deleteEntryById)
router.put('/diary/:entryId', passport.authenticate('jwt', { session: false }), diaryController.updateEntryById)
router.post('/diary', passport.authenticate('jwt', { session: false }), diaryController.createEntry)

// Chat
router.get('/chats', passport.authenticate('jwt', { session: false }), chatController.getAllChatsByUserId)
router.get('/chats/:chatId', passport.authenticate('jwt', { session: false }), chatController.getChatByChatId)
router.post('/chats', passport.authenticate('jwt', { session: false }), chatController.createChat)
router.post('/chats/:chatId/sendMessage', passport.authenticate('jwt', { session: false }), chatController.createMessageForChatId)

// Users
router.get('/user/:userId/diary', passport.authenticate('jwt', { session: false }), diaryController.getAllEntriesByUserId)


module.exports = router