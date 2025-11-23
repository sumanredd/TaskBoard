const express = require('express')
const router = express.Router()
const Joi = require('joi')
const Task = require('../models/Task')
const { auth } = require('../middleware/auth')

const taskSchema = Joi.object({
  title: Joi.string().min(1).required(),
  description: Joi.string().allow(''),
  status: Joi.string().valid('pending','in-progress','completed')
})

router.post('/', auth, async (req, res) => {
  const { error } = taskSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })
  const { title, description, status } = req.body
  try {
    const task = new Task({ title, description, status, createdBy: req.user._id })
    await task.save()
    res.status(201).json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = Math.min(parseInt(req.query.limit) || 10, 100)
    const q = {}
    if (req.query.status) q.status = req.query.status
    if (req.query.search) q.title = { $regex: req.query.search, $options: 'i' }
    if (req.user.role === 'admin') {
      const tasks = await Task.find(q).populate('createdBy','username email').skip((page-1)*limit).limit(limit).sort({ createdAt: -1 })
      return res.json(tasks)
    } else {
      q.createdBy = req.user._id
      const tasks = await Task.find(q).sort({ createdAt: -1 })
      return res.json(tasks)
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('createdBy','username email')
    if (!task) return res.status(404).json({ message: 'Not found' })
    if (req.user.role !== 'admin' && String(task.createdBy._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/:id', auth, async (req, res) => {
  const { error } = taskSchema.validate(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ message: 'Not found' })
    if (req.user.role !== 'admin' && String(task.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    if (req.user.role === 'admin' && String(task.createdBy) !== String(req.user._id)) {
      task.editedByAdmin = true
    }
    task.title = req.body.title
    task.description = req.body.description || ''
    if (req.body.status) task.status = req.body.status
    await task.save()
    res.json(task)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ message: 'Not found' })
    if (req.user.role !== 'admin' && String(task.createdBy) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    await Task.deleteOne({ _id: req.params.id })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
