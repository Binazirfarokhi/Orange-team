const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

// var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(jsonParser);
app.use('/profile', require('./controllers/profile.controller'))
app.use('/auth', require('./controllers/auth.controller'))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})