const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  blogImage: {
    type: String,
    required: true,
  },
  blogLike: {
    type: Number,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model('Blog', blogSchema)
