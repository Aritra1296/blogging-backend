const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')


//GET ALL THE USERS
router.get('/allUsers', async (req, res) => {
  try {
    const user = await User.find()
    res.json(user)
  } catch (error) {
    res.json({ message: error })
  }
})

//SUBMIT A NEW USER
router.post('/newUser', async (req, res) => {
  try {
    const { email, userName, password } = req.body

    //VALIDATION ALL  FIELDS REQUIRED
    if (!userName || !email || !password)
      return res
        .status(400)
        .json({ errorMessage: 'Please enter all required fields ' })
    //VALIDATION SAME USER
    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ errorMessage: 'An user already present' })

    //HASH THE PASSWORD
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    //SAVE USESR
    const newUser = new User({
      userRole: 'User',
      email,
      userName,
      passwordHash,
    })
    const savedUser = await newUser.save()

    //CREATTING TOKEN
    const token = jwt.sign(
      {
        user: savedUser._id,
      },
      process.env.JWT_SECRET
    )
   
    //SEND TOKEN TO HTTP-ONLY COOKIE
    res
      .cookie('token', token, {
        domain: process.env.COOKIE_DOMAIN,
        withCredentials: true,
        httpOnly: true,
      })
      .send()
  } catch (err) {
    res.json({ message: err })
  }
})

//LOG IN METHOD
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    //VALIDATION ALL FIELDS REQUIRED
    if (!email || !password)
      return res
        .status(400)
        .json({ errorMessage: 'Please enter all required fields' })

    //CHECK USER ID
    const existingUser = await User.findOne({ email })
    if (!existingUser)
      return res.status(401).json({ errorMessage: 'Wrong email or password' })

    //CHECK PASSWORD
    const passwordCorrect = await bcrypt.compare(
      password,
      existingUser.passwordHash
    )
    if (!passwordCorrect)
      return res.status(401).json({ errorMessage: 'Wrong email or password' })

    //SIGN TOKEN
    const token = jwt.sign(
      {
        userId: existingUser._id,
        userName: existingUser.userName,
        userRole :existingUser.userRole
      },
      process.env.JWT_SECRET
    )

    //SEND TOKEN TO HTTP-ONLY COOKIE
    res
      .cookie('token', token, {
        domain: process.env.COOKIE_DOMAIN,
        withCredentials: true,
        httpOnly: true,
      })
      .json(existingUser)
      .send()
  } catch (error) {
    console.log(error)
  }
})

//CHECK LOGGED IN METHOD
router.get('/loggedIn', async (req, res) => {
  try {
    const token = req.cookies.token
    if (!token) return res.status(401).json(false)
    const jwtToken = jwt.verify(token, process.env.JWT_SECRET)
    //console.log(jwtToken)
    res.send({
      loggedIn: true,
      userId: jwtToken.userId,
      userName: jwtToken.userName,
      userRole: jwtToken.userRole,
    })
  } catch (error) {
    console.log(error)
    res.json(false)
  }
})

//LOG OUT METHOD
router.get('/logout', async (req, res) => {
  res
    .cookie('token', '', {
      domain: process.env.COOKIE_DOMAIN,
      httpOnly: true,
      expires: new Date(0),
    })
    .send()
})

module.exports = router
