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
router.post(
  '/submitNew',
  upload.single('productImage'),
  async (req, res) => {
    const blog = new Blog({
      name: req.body.name,
      description: req.body.description,
      blogLike: req.body.blogLike,
      blogImage: req.files.map((file) => {
        return file.path
      }),
    })
    try {
      const savedBlog = await blog.save()
      res.json(savedBlog)
    } catch (err) {
      res.json({ message: err })
    }
  }
)

module.exports = router
