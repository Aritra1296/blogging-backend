const express = require('express')
const router = express.Router()
const Comment = require('../models/Comment')


//GET ALL THE COMMENTS OF A BLOG
router.get('/:blogId', async (req, res) => {
  try {
    const comment = await Comment.find({ blogId: req.params.blogId })
    res.json(comment)
  } catch (error) {
    res.json({ message: error })
  }
})

//SUBMIT A MESSAGE
router.post('/subMitNew', async (req, res) => {
  const comment = new Comment({
    userId: req.body.userId,
    blogId: req.body.blogId,
    comment: req.body.comment,
    commentLike: req.body.commentLike,
  })
  try {
    const savedComment = await comment.save()
    res.json(savedComment)
  } catch (err) {
    res.json({ message: err })
  }
})

module.exports = router
