const mod = require('./todoService.js')

async function posts() {

  const todos = await mod.TodoService.getTodos()
  console.log(todos)
}

posts()
