const Chat = require('../models/chat')
const User = require('../models/user')

exports.getAllChatsByUserId = (req, res) => {
  if (!req.user.id) {
    return res.status(400).json({ 'msg': 'No user id found in auth token.'})
  }

  Chat.find({ $or:[ {clientId: req.user.id}, {expertId: req.user.id} ] }, (err, chats) => {
    if (err) {
      return res.status(500).json({ 'msg': err })
    }

    if (!chats) {
      return res.status(404).json({ 'msg': 'No chats found for specified user.'})
    }

    return res.status(200).json(chats);
  })
  .sort('-updatedAt')
  .populate({
    path: 'clientId',
    select: 'email'
  })
}

exports.getChatByChatId = (req, res) => {
  if (!req.user.id) {
    return res.status(400).json({ 'msg': 'No user id found in auth token.'})
  }

  if (!req.params.chatId) {
    return res.status(400).json({ 'msg': 'No param for chatId found.'})
  }

  Chat.findOne({ _id: req.params.chatId }, (err, chat) => {
    if (err) {
      return res.status(500).json({ 'msg': err })
    }

    if (!chat) {
      return res.status(404).json({ 'msg': 'No chat found with ID ' + req.params.chatId })
    }
    console.log('chat: ', chat)

    // Check if user is a client or expert belonging to this chat
    if ( ((chat.clientId != req.user.id) && (chat.expertId != req.user.id)) ) {
      return res.status(401).json({ 'msg': 'Unauthorised' })
    }

    return res.status(200).json(chat);
  })
  .populate({
    path: 'clientId',
    select: 'email'
  })
}

exports.createChat = (req, res) => {
  // Get all expert users
  User.find({ isExpert: true }, (err, expertUsers) => {
    if (err) {
      return res.status(500).json({ 'msg': err.message })
    }

    if (expertUsers.length < 1) {
      return res.status(400).json({ 'msg': 'No expert found.'})
    }

    // User cannot already have a chat
    Chat.countDocuments( { clientId: req.user.id }, (count) => {
      if (count > 0) {
        return res.status(400).json({ 'msg': 'Clients can only have 1 chat.'})
      }

      // Check if the user creating this chat is an expert himself
      let clientIsExpert = () => {
        console.log('Experts: ', expertUsers)
        let clientThatIsExpert = expertUsers.find( (user) => {
          return (user._id == req.user.id)
        })
        return (clientThatIsExpert !== undefined)
      }
  
      if (clientIsExpert()) {
        return res.status(400).json({ 'msg': 'Experts cannot create new chats.'})
      }
  
      // Get first expert
      let expertUser = expertUsers[0]
  
      console.log('Found expert user: ', expertUser.email)
  
      // Create new chat
      let newChat = Chat({
        clientId: req.user.id,
        expertId: expertUser._id
      })
  
      newChat.save( (err, createdChat) => {
        if (err) {
          return res.status(500).json({ 'msg': err.message })
        }
  
        console.log('Created chat: ', createdChat);
        return res.status(201).send();
      })
    })
  })
}

exports.createMessageForChatId = (req, res) => {
  if (!req.user.id) {
    return res.status(400).json({ 'msg': 'No user id found in auth token.'})
  }

  console.log('req.body: ',req.body)

  if (!req.body.message) {
    return res.status(400).json({ 'msg': 'No param for message found.'})
  }

  if (!req.params.chatId) {
    return res.status(400).json({ 'msg': 'No param for chatId found.'})
  }

  Chat.findOne({ _id: req.params.chatId }, (err, chat) => {
    if (err) {
      return res.status(500).json({ 'msg': err })
    }

    if (!chat) {
      return res.status(404).json({ 'msg': 'No chat found with ID ' + req.params.chatId })
    }

    // Check if user is a client or expert belonging to this chat
    if ( ((chat.clientId != req.user.id) && (chat.expertId != req.user.id)) ) {
      return res.status(401).json({ 'msg': 'Unauthorised' })
    }

    // Update chat with new message
    chat.messages.push(
      {
        senderType: ((chat.expertId == req.user.id) ? 'expert' : 'client'),
        text: req.body.message
      }
    )
    chat.updatedAt = new Date()

    chat.save((err, updatedChat) => {
      if (err) {
        return res.status(500).json({ 'msg': err.message })
      }
  
      console.log('Updated chat: ', updatedChat)
      return res.status(201).json(updatedChat)
    })
  })
}