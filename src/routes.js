const express = require('express')
const router = express.Router()
const userController = require('./controllers/user-controller')
const diaryController = require('./controllers/diary-controller')
const passport = require('passport')

router.get('/', (req, res) => {
  return res.send('Hello, this is the API');
})

router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)

router.get('/diary', passport.authenticate('jwt', { session: false }), diaryController.getAllEntries)
router.get('/diary/:entryId', passport.authenticate('jwt', { session: false }), diaryController.getEntryById)
router.delete('/diary/:entryId', passport.authenticate('jwt', { session: false }), diaryController.deleteEntryById)
router.put('/diary/:entryId', passport.authenticate('jwt', { session: false }), diaryController.updateEntryById)
router.post('/diary', passport.authenticate('jwt', { session: false }), diaryController.createEntry)

module.exports = router