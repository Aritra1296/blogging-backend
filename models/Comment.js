const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  blogId: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  commentLike: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Comment', commentSchema)
