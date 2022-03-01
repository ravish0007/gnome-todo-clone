let todos = []
const priorities = ['None', 'Low', 'Medium', 'High']

let toggleDoneState = false

function primaryDiv(todo) {
  let template =
    `<div class="todo-container">
        <div class="todo-item">
            <input class="toggle" type="checkbox" {{checked}}>
            <input class="todo-label" value="{{title}}"></input>
        </div>
        <div class="date-container">
            <label class="duedate">{{dueDate}}</label>
            <button class="expander">▾</button>
        </div>
     </div>`

  let checkedState = todo.completed ? 'checked' : ''

  template = template.replace('{{checked}}', checkedState)
  template = template.replace('{{title}}', todo.title)
  template = template.replace('{{dueDate}}', todo.dueDate)

  return template
}

function elongatedDiv(todo) {
  let priorityOptions = ''

  priorities.map((x, index) => {
    priorityOptions += `<option value="${index}" ${todo.priority === index ? 'selected' : ''}>` +
      x + '</option>'
  })

  let template =
    `<div class="elongated-div hidden" >

          <div class="notes-div">
              <label class="notes-label">Notes</label>
              <textarea class="notes">{{notes}}</textarea>
          </div>

          <div class="priority-div">
              <div>
                  <label class=duedate-label>Due Date</label>
                  <input type="date" class="date-selector" value="{{dueDate}}"/>

                  <label class="priority-label">Priority</label>
                  <select class="priority-selector">
                          ${priorityOptions}
                  </select>
              </div>
              <button class="delete-button">Delete</button>
          </div>
    </div>`

  template = template.replace('{{notes}}', todo.notes)
  template = template.replace('{{dueDate}}', todo.duedate)

  return template
}

function makeTodo(todo) {
  const todoElement = document.createElement('li')
  todoElement.setAttribute('id', todo.id)
  todoElement.setAttribute('class', "todo-li")

  todoElement.innerHTML = primaryDiv(todo) + elongatedDiv(todo)

  // Adding strike class if checked
  if (todo.completed) {
    todoElement.querySelector('.toggle').setAttribute('checked', 'true')
    todoElement.querySelector('.todo-label').classList.add('strike')
  }

  // Adding border based on priority
  todoElement.classList.add(priorities[todo.priority].toLowerCase())

  // adding event listners
  const eventArray = [
    ['.todo-label', 'blur', editTodo],
    ['.toggle', 'click', toggleTodo],
    ['.expander', 'click', showMoreInfo],
    ['.notes', 'blur', setNotes],
    ['.date-selector', 'change', setDate],
    ['.priority-selector', 'change', setPriority],
    ['.delete-button', 'click', deleteTodo]
  ]

  eventArray.map(([element, eventType, eventHandler]) => {
    todoElement.querySelector(element).addEventListener(eventType, eventHandler)
  })

  return todoElement
}

function addTodo(event) {
  if (event.keyCode !== 13 || !event.target.value) return

  const newTodo = {
    title: event.target.value,
    completed: false,
    priority: 0,
    dueDate: '',
    id: Date.now(),
    notes: ''
  }

  todos.push(newTodo)

  const li = makeTodo(newTodo)
  document.querySelector('.todo-list').append(li)

  event.target.value = '' // reset input

  syncLocalStorage()
  toggleClearButton()
}

function getParent(event, index) {
  const path = event.path || (event.composedPath && event.composedPath())
  const parent = path[index]
  return parent
}

function toggleTodo(event) {
  const parent = getParent(event, 3)

  for (const todo of todos) {

    if (todo.id !== Number(parent.id)) {
      continue
    }

    todo.completed = !todo.completed

    if (todo.completed) {
      event.target.checked = true
      // check this later 
      event.target.nextElementSibling.classList.toggle('strike')
    }

    syncLocalStorage()
    toggleDoneTasks()
    break
  }
}

function deleteTodo(event) {
  const parent = getParent(event, 3)

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === Number(parent.id)) {
      todos.splice(i, 1)
      parent.parentElement.removeChild(parent)
      syncLocalStorage()
      toggleClearButton()
      break
    }
  }
}

function displayTodos(todos_ = todos) {
  const todoList = document.querySelector('.todo-list')
  todoList.innerHTML = ''

  for (const task of todos_) {
    const li = makeTodo(task)
    todoList.appendChild(li)
  }
}

function editTodo(event) {
  const parent = getParent(event, 2)

  for (const task of todos) {
    if (task.id === Number(parent.id)) {
      task.title = event.target.value
      syncLocalStorage()
    }
  }
}

function showMoreInfo(event) {
  const parent = getParent(event, 3)
  const elongatedDiv = parent.querySelector('.elongated-div')
  const expander = parent.querySelector('.expander')

  if (elongatedDiv.classList.contains('hidden')) {
    elongatedDiv.classList.remove('hidden')
    expander.innerText = '▴'
  } else {
    elongatedDiv.classList.add('hidden')
    expander.innerText = '▾'
  }
}

function setDate(event) {
  const parent = getParent(event, 4)
  const dateLabel = parent.querySelector('.duedate')

  for (const todo of todos) {
    if (todo.id === Number(parent.id)) {
      todo.dueDate = event.target.value
      dateLabel.innerText = todo.dueDate
      syncLocalStorage()
      break
    }
  }
}

function setPriority(event) {
  const parent = getParent(event, 4)

  for (const todo of todos) {
    if (todo.id === Number(parent.id)) {
      todo.priority = Number(event.target.value)

      for (const priority of priorities) {
        const priorityClass = priority.toLowerCase()

        if (parent.classList.contains(priorityClass)) {
          parent.classList.remove(priorityClass)
          break
        }
      }

      parent.classList.add(priorities[todo.priority].toLowerCase())

      syncLocalStorage()
      break
    }
  }
}

function setNotes(event) {
  const parent = getParent(event, 3)

  for (const todo of todos) {
    if (todo.id === Number(parent.id)) {
      todo.notes = event.target.value
      syncLocalStorage()
      break
    }
  }
}

function syncLocalStorage(command) {
  const todoStore = localStorage

  switch (command) {
    case 'init':
      if (todoStore.todos) {
        todos = JSON.parse(todoStore.todos)
      }
      break

    case 'clear':
      todoStore.removeItem('todos')
      todos = []
      break


    default: todoStore.todos = JSON.stringify(todos)
  }
}

function clearAllTasks() {
  syncLocalStorage('clear')
  document.querySelector('.todo-list').innerHTML = ''
  toggleFooter()
}

function toggleClearButton() {
  const clearTasks = document.getElementById('clear')
  if (todos.length) {
    clearTasks.style.visibility = 'visible'
  } else {
    clearTasks.style.visibility = 'hidden'
  }
}

function toggleDoneTasks(event) {
  const footer = document.querySelector('footer')
  const showTasksButton = document.querySelector('#toggle-done')

  const tempTodos = todos.filter(todo => !todo.completed)
  const completedTasksCount = todos.length - tempTodos.length

  if (event && event.target.id === "toggle-done") {
    toggleDoneState = !toggleDoneState
  }

  if (completedTasksCount > 0) {
    footer.style.visibility = 'visible'

    if (toggleDoneState) {
      displayTodos(tempTodos)
      showTasksButton.innerHTML = `Show Done Tasks (${completedTasksCount})`
    } else {
      displayTodos(todos)
      showTasksButton.innerHTML = `Hide Done Tasks (${completedTasksCount})`
    }
  } else {
    displayTodos()
    footer.style.visibility = 'hidden'
  }
}

function toggleFooter() {
  toggleDoneTasks()
  toggleClearButton()
}

function clearDoneTasks() {
  todos = todos.filter(x => !x.completed)
  syncLocalStorage()
  toggleDoneState = false
  toggleFooter()
}

function main() {
  syncLocalStorage('init')
  displayTodos()
  toggleFooter()
}

const newTodo = document.getElementById('new-todo')
newTodo.addEventListener('keypress', addTodo)

const clearTasksButton = document.getElementById('clear')
clearTasksButton.addEventListener('click', clearAllTasks)

const clearDoneButton = document.getElementById('clear-done')
clearDoneButton.addEventListener('click', clearDoneTasks)

const showTasksButton = document.getElementById('toggle-done')
showTasksButton.addEventListener('click', toggleDoneTasks)

main()
