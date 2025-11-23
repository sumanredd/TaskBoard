const mongoose = require('mongoose')
const Schema = mongoose.Schema
const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['pending','in-progress','completed'], default: 'pending' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  editedByAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})
module.exports = mongoose.model('Task', taskSchema)
