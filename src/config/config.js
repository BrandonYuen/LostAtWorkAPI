const credentials = require('./credentials')

module.exports = {
  jwtSecret: 'lost-at-work-pwa-brandonyuen',
  db: 'mongodb+srv://'+credentials.dbUsername+':'+credentials.dbUsername+'@cluster0-bsq9g.mongodb.net/lostatwork'
}