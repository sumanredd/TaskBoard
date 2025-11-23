const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Joi = require('joi')
const User = require('../models/User')

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user','admin')
})

router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })
  const { username, email, password, role } = req.body
  try {
    const existing = await User.findOne({ $or: [{ email }, { username }] })
    if (existing) return res.status(400).json({ message: 'User already exists' })
    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ username, email, password: hashed, role: role || 'user' })
    await user.save()
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
    res.json({ token, user: { id: user._id, username: user.username, email: user.email, role: user.role } })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

const { auth } = require('../middleware/auth')
router.get('/me', auth, async (req, res) => {
  const u = req.user
  res.json({ id: u._id, username: u.username, email: u.email, role: u.role })
})

module.exports = router
