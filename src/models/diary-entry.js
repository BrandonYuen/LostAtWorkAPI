const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId;

let DiaryEntrySchema = new mongoose.Schema({
  userId: { type: ObjectId, required: true },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  misconductType: { type: String, required: true },
  content: { type: String, required: true }
})

module.exports = mongoose.model('DiaryEntry', DiaryEntrySchema, 'diaryentries')
