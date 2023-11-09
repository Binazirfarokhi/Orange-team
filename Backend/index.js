const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const CORS = require("cors");
var jsonParser = bodyParser.json();


// var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(jsonParser);
app.use(CORS());

app.use('/profile', require('./controllers/profile.controller'))
app.use('/auth', require('./controllers/auth.controller'))
app.use('/children', require('./controllers/children.controller'))
app.use('/orgs', require('./controllers/orgs.controller'))
app.use('/chat', require('./controllers/chat.controller'))
app.use('/photos', require('./controllers/photos.controller'))
app.use('/location', require('./controllers/location.controller'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});