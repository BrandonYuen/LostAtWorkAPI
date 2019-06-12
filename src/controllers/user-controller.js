const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../config/config')

function createToken(user) {
  return jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: 1000000 //24h
  })
}

exports.registerUser = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ 'msg': 'You need to send email and password'})
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.result(400).json({ 'msg': err })
    }

    if (user) {
      return res.status(400).json({ 'msg': 'The user already exists'})
    }

    let newUser = User(req.body)
    newUser.save((err, newUser) => {
      if (err) {
        return res.status(500).json({ 'msg': err.message })
      }

      return res.status(201).json(newUser);
    })
  })
}

exports.loginUser = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ 'msg': 'You need to send email and password'})
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.result(400).json({ 'msg': err})
    }

    if (!user) {
      return res.status(400).json({ 'msg': 'The user does not exist'})
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        return res.status(200).json({
          token: createToken(user),
          id: user.id
        })
      } else {
        return res.status(400).json({ 'msg': 'Password incorrect'})
      }
    })
  })
}