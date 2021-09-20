const express = require('express')
const router = express.Router()
const Comment = require('../models/Comment')
const auth = require('../middleware/auth')


//GET ALL THE COMMENTS OF A BLOG
router.get('/:blogId', auth, async (req, res) => {
  try {
    const comment = await Comment.find({ blogId: req.params.blogId })
    res.json(comment)
  } catch (error) {
    res.json({ message: error })
  }
})

//SUBMIT A Comment
router.post('/subMitNew', auth, async (req, res) => {
  const comment = new Comment({
    userName: req.body.userName,
    blogId: req.body.blogId,
    comment: req.body.comment,
  })
  try {
    const savedComment = await comment.save()
    res.json(savedComment)
  } catch (err) {
    res.json({ message: err })
  }
})

module.exports = router
