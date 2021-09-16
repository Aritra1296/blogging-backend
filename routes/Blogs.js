const express = require('express')
const router = express.Router()
const Blog = require('../models/Blog')
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'BlogImages')
  },
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, Date.now() + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })

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
router.post('/submitNew', upload.single('blogImage'), async (req, res) => {
  const blog = new Blog({
    name: req.body.blogName,
    description: req.body.blogDescription,
    blogLike: 0,
    blogImage: req.file.path,
  })

  try {
    const savedBlog = await blog.save()
    res.json(savedBlog)
  } catch (err) {
    res.json({ message: err })
  }
})

//ADD LIKE TO A BLOG
router.patch('/addLike', async (req, res) => {
  console.log(req.body)
  try {
    const updatedBlog = await Blog.updateOne(
      { _id: req.body.blogId },
      { $push: { likedUser: req.body.userId } },
      { $push: { blogLike: { likedUser: $size } } }
    )
    res.json(updatedBlog)
  } catch (err) {
    res.json({ message: err })
  }
})

//REMOVE LIKE TO A BLOG
router.patch('/removeLike', async (req, res) => {
  console.log(req.body)
  try {
    const updatedBlog = await Blog.updateOne(
      { _id: req.body.blogId },
      { $pull: { likedUser: req.body.userId } }
    )
    res.json(updatedBlog)
  } catch (err) {
    res.json({ message: err })
  }
})

module.exports = router
