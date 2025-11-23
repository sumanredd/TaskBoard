const { PrismaClient } = require('@prisma/client')
const mongoose = require('mongoose')
const User = require('./models/User')
const Task = require('./models/Task')
require('dotenv').config()
const prisma = new PrismaClient()
async function main(){
  await mongoose.connect(process.env.MONGO_URI)
  const users = await prisma.user.findMany()
  for (const u of users){
    const exists = await User.findOne({ email: u.email })
    if (exists) continue
    const newU = new User({ username: u.username, email: u.email, password: u.password, role: (u.role || 'user'), createdAt: u.createdAt })
    await newU.save()
  }
  const tasks = await prisma.task.findMany()
  for (const t of tasks){
    const creator = await prisma.user.findUnique({ where: { id: t.userId } })
    const userInMongo = await User.findOne({ email: creator.email })
    if (!userInMongo) continue
    const newT = new Task({ title: t.title, description: t.description || '', status: t.status || 'pending', createdBy: userInMongo._id, editedByAdmin: t.editedByAdmin || false, createdAt: t.createdAt })
    await newT.save()
  }
  console.log('Done')
  await prisma.$disconnect()
  await mongoose.disconnect()
}
main().catch(e => { console.error(e); process.exit(1) })
