require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.log('MongoDB connection error:', err))

// Schema
const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }
})

const Menu = mongoose.model('Menu', menuSchema)

// POST /menu - Add a new menu item
app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body
    if (!name || price == null) {
      return res.status(400).json({ error: 'Name and price are required' })
    }
    const newItem = new Menu({ name, description, price })
    await newItem.save()
    res.status(201).json({ message: 'Menu item added', item: newItem })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /menu - Retrieve all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await Menu.find()
    res.json(menuItems)
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
