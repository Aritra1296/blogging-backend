const express = require('express')
const router = express.Router()
const Blog = require('../models/Blog')
const path = require('path')
const multer = require('multer')
const auth = require('../middleware/auth')

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
router.get('/all', auth, async (req, res) => {
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
  auth,
  upload.single('blogImage'),
  async (req, res) => {
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
  }
)

//ADD LIKE TO A BLOG
router.patch('/addLike', auth, async (req, res) => {
  try {
    console.log(req.body)
    const likedBlog = await Blog.find({ _id: req.body.blogId })
    console.log(likedBlog)
    console.log(likedBlog[0].likedUser)
    if (!likedBlog[0].likedUser.includes(req.body.userId)) {
        const updatedBlog = await Blog.updateOne(
        { _id: req.body.blogId },
        { $addToSet: { likedUser: req.body.userId }, $inc: { blogLike: 1 } }
      )
      res.json(updatedBlog)
    } else {
      res.status(500).json({ message: 'User Already Exist' })
    }
  } catch (err) {
    res.status(500).json({ message: err })
  }
})

//REMOVE LIKE TO A BLOG
router.patch('/removeLike', auth, async (req, res) => {
  try {
   const likedBlog = await Blog.find({ _id: req.body.blogId })
   if (likedBlog[0].likedUser.includes(req.body.userId)) {
     const updatedBlog = await Blog.updateOne(
       { _id: req.body.blogId },
       { $pull: { likedUser: req.body.userId }, $inc: { blogLike: -1 } }
     )
     res.json(updatedBlog)
   } else {
     res.status(500).json({ message: 'User Already Exist' })
   }
  } catch (err) {
    res.json({ message: err })
  }
})

module.exports = router
