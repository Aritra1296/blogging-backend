const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  blogImage: {
    type: String,
    required: true,
  },
  likedUser: {
    type: [String],
    trim: true,
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
