
require('dotenv').config()

const express = require('express')
const cors = require('cors')
const { Sequelize, Model, DataTypes } = require('sequelize')
const { request } = require('express')

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.static('public'))


const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {} // no ssl
})

const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}
connectDB()

class Todo extends Model { }
Todo.init({
  id: {
    type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT
  },
  completed: {
    type: DataTypes.BOOLEAN
  },
  priority: {
    type: DataTypes.INTEGER
  },
  notes: {
    type: DataTypes.TEXT
  },
  dueDate: {
    type: DataTypes.TEXT
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'todo'
})

app.get('/api/todos', async (request, response) => {
  try {
    const todos = await Todo.findAll()
    response.json(todos)
  } catch (error) {
    console.error('Fetch failed', error)
  }
})

app.post('/api/todos', async (request, response) => {
  try {
    const body = request.body

    // body.dueDate = new Date().toISOString().split('T')[0]

    if (!body.title) {
      return response.status(400).json({
        error: 'title missing'
      })
    }
    const todo = await Todo.create(body)
    response.json(todo)
  } catch (error) {
    console.log(error)
  }
})

app.put('/api/todos/:id', async (request, response) => {

  if (!request.params.id || !request.body.title) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  try {
    const todo = await Todo.findByPk(request.params.id)

    if (todo) {
      Todo.update(
        { ...request.body, id: parseInt(request.params.id) },
        { where: { id: request.params.id } }
      )
      response.status(200).end()
    } else {
      return response.status(400).json({
        error: 'resource not found'
      })
    }
  } catch (error) {
    console.log(error)
  }
})

app.delete('/api/todos/:id', async (request, response) => {
  if (!request.params.id) {
    return response.status(400).json({
      error: 'id missing'
    })
  }

  try {
    const todo = await Todo.findByPk(request.params.id)

    if (todo) {
      await todo.destroy()
      response.status(200).end()
    } else {
      response.status(404).end()
    }
  } catch (error) {
    console.log(error)
  }
})

app.delete('/api/todos', async (request, response) => {
  try {
    await Todo.destroy({ where: {}, truncate: true })
    response.status(200).end()
  } catch (error) {
    console.log(error)
  }
})

app.delete('/api/todosCompleted', async (request, response) => {
  try {
    await Todo.destroy({ where: { completed: true } })
    response.status(200).end()
  } catch (error) {
    console.log(error)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => { console.log(`Server running.. on ${PORT}`) })
