const express = require('express')
const router = express.Router()
const Blog = require('../models/Blog')


//GET ALL THE BLOGS
router.get('/all', async (req, res) => {
  try {
    const blog = await Blog.find()
    res.json(blog)
  } catch (error) {
    res.json({ message: error })
  }
})

//SUBMIT A BLOGS
router.post('/submitNew', async (req, res) => {
  const blog = new Blog({
    name: req.body.name,
    description: req.body.description,
    blogImage: req.body.blogImage,
    blogLike: req.body.blogLike,
  })
  try {
    const savedBlog = await blog.save()
    res.json(savedBlog)
  } catch (err) {
    res.json({ message: err })
  }
})

module.exports = router
