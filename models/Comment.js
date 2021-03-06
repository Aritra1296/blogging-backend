const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  blogId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Comment', commentSchema)
