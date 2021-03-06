const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv/config')

//MIDDLEWARE
//COFIGURE CORS
app.use('/BlogImages',express.static('BlogImages'));
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: [process.env.ALLOW_DOMAIN],
    credentials: true,
  })
)

//IMPORT ROUTER
app.use('/users', require('./routes/Users'))
app.use('/blogs', require('./routes/Blogs'))
app.use('/comments', require('./routes/Comments'))


//CONNECT TO DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true},
  () => console.log("connected to db!!")
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once("open", function () {
  console.log("Successfully connected to MongoDB!");
});

//HOW TO START LISTENING TO SERVER
app.listen(process.env.PORT, () =>
  console.log(`app started on port: ${process.env.PORT}`)
)
