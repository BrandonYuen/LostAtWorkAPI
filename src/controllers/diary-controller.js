const DiaryEntry = require('../models/diary-entry')

exports.getAllEntries = (req, res) => {
  if (!req.user.id) {
    return res.status(400).json({ 'msg': 'No user id found in auth token.'})
  }

  DiaryEntry.find({ userId: req.user.id }, (err, entries) => {
    if (err) {
      return res.result(500).json({ 'msg': err })
    }

    if (!entries) {
      return res.status(404).json({ 'msg': 'No entries found.'})
    }

    return res.status(200).json(entries);
  }).sort('-date')
}

exports.getEntryById = (req, res) => {
  if (!req.user.id) {
    return res.status(400).json({ 'msg': 'No user id found in auth token.'})
  }

  if (!req.params.entryId) {
    return res.status(400).json({ 'msg': 'No entry id found in params.'})
  }

  DiaryEntry.findOne({ _id: req.params.entryId }, (err, entry) => {
    if (err) {
      return res.result(500).json({ 'msg': err })
    }

    if (!entry) {
      return res.status(404).json({ 'msg': 'No entry found with ID ' + req.params.entryId })
    }

    // Check if entry belongs to the user requesting it
    if (entry.userId != req.user.id) {
      return res.status(401).json({ 'msg': 'Unauthorised' })
    }

    return res.status(200).json(entry);
  })
}

exports.deleteEntryById = (req, res) => {
  if (!req.user.id) {
    return res.status(400).json({ 'msg': 'No user id found in auth token.'})
  }

  if (!req.params.entryId) {
    return res.status(400).json({ 'msg': 'No entry id found in params.'})
  }

  DiaryEntry.findOne({ _id: req.params.entryId }, (err, entry) => {
    if (err) {
      return res.result(500).json({ 'msg': err })
    }

    if (!entry) {
      return res.status(404).json({ 'msg': 'No entry found with ID ' + req.params.entryId })
    }

    // Check if entry belongs to the user requesting it
    if (entry.userId != req.user.id) {
      return res.status(401).json({ 'msg': 'Unauthorised' })
    }

    // Delete entry
    DiaryEntry.deleteOne({ _id: req.params.entryId }, (err) => {
      if (err) {
        return res.result(400).json({ 'msg': err })
      }
      console.log('Deleted entry: ', req.params.entryId);
      return res.status(200).send()
    })
  })
}

exports.createEntry = (req, res) => {
  if (!req.user.id) {
    return res.status(400).json({ 'msg': 'No user id found in auth token.'})
  }

  if (!req.body.title || !req.body.misconductType || !req.body.content) {
    return res.status(400).json({ 'msg': 'Not all params are defined. (title, misconductType, content)'})
  }

  let newEntry = DiaryEntry({
    userId: req.user.id,
    title: req.body.title,
    misconductType: req.body.misconductType,
    content: req.body.content,
    date: new Date()
  })
  newEntry.save((err, createdEntry) => {
    if (err) {
      return res.status(500).json({ 'msg': err.message })
    }

    console.log('Created entry: ', createdEntry);
    return res.status(201).json(createdEntry);
  })
}

exports.updateEntryById = (req, res) => {
  if (!req.user.id) {
    return res.status(400).json({ 'msg': 'No user id found in auth token.'})
  }

  console.log('req.body: ',req.body)

  if (!req.params.entryId || !req.body.title || !req.body.misconductType || !req.body.content) {
    return res.status(400).json({ 'msg': 'Not all params are defined. (entryId, title, misconductType, content)'})
  }

  DiaryEntry.findOne({ _id: req.params.entryId }, (err, entry) => {
    if (err) {
      return res.result(500).json({ 'msg': err })
    }

    if (!entry) {
      return res.status(404).json({ 'msg': 'No entry found with ID ' + req.params.entryId })
    }

    // Check if entry belongs to the user requesting it
    if (entry.userId != req.user.id) {
      return res.status(401).json({ 'msg': 'Unauthorised' })
    }

    entry.title = req.body.title
    entry.content = req.body.content
    entry.misconductType = req.body.misconductType

    entry.save((err, updatedEntry) => {
      if (err) {
        return res.status(500).json({ 'msg': err.message })
      }
  
      console.log('Updated entry: ', updatedEntry);
      return res.status(200).json(updatedEntry)
    })
  })
}