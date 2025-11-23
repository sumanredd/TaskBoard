require('dotenv').config()
const mongoose = require('mongoose')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
async function main(){
  await mongoose.connect(process.env.MONGO_URI)
  const exists = await User.findOne({ email: 'admin@example.com' })
  if (!exists){
    const hashed = await bcrypt.hash('Admin@123', 10)
    const u = new User({ username: 'admin', email: 'admin@example.com', password: hashed, role: 'admin' })
    await u.save()
  }
  await mongoose.disconnect()
  console.log('seed done')
}
main().catch(e => { console.error(e); process.exit(1) })
