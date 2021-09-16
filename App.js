const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
require('dotenv/config')
const Pusher = require('pusher')

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

//PUSHER
const pusher = new Pusher({
  appId: '1267800',
  key: 'a2a19cf82e2bbe61e63b',
  secret: '036e7f14a43ba852f794',
  cluster: 'ap2',
  useTLS: true,
})


//CONNECT TO DB
mongoose.connect(
  process.env.DB_CONNECTION,
  { useUnifiedTopology: true, useNewUrlParser: true },
  () => console.log('connected to db!!')
)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection Error:'))
db.once('open', function () {
  console.log('Successfully connected to MongoDB!')
  //PUSHER TRIGGER
  const commentCollection = db.collection('comments')
  const changeStream = commentCollection.watch()
  changeStream.on('change', (change) => {
   // console.log('A change occured', change)

    if (change.operationType === 'insert') {
      const commentDetails = change.fullDocument
      pusher.trigger('comments', 'inserted', {
        userName: commentDetails.userName,
        blogId: commentDetails.blogId,
        comment: commentDetails.comment,
      })
    } else {
      console.log('Error triggerring pusher')
    }
  })
})

//HOW TO START LISTENING TO SERVER
app.listen(process.env.PORT, () =>
  console.log(`app started on port: ${process.env.PORT}`)
)
