const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId;

let ChatSchema = new mongoose.Schema({
  clientId: { type: ObjectId, required: true, ref: 'User' },
  expertId: { type: ObjectId, required: true, ref: 'User' },
  updatedAt: { type: Date, required: true, default: function(){return new Date()} },
  messages: [
    {
      senderType: { type: String, enum: ['client', 'expert'], required: true },
      date: { type: Date, required: true, default: function(){return new Date()} },
      text: { type: String, required: true }
    }
  ]
})

module.exports = mongoose.model('Chat', ChatSchema, 'chats')
