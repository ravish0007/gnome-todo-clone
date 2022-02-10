let todos = []

const priorities = ['None', 'Low', 'Medium', 'High']

const model = {
  title: '',
  completed: false,
  priority: null,
  dueDate: '',
  id: null,
  notes: ''
}

let toggleDoneState = false

function makeTodo (task) {
  const newTask = document.createElement('li')
  newTask.setAttribute('id', task.id)

  const div = document.createElement('div')
  div.setAttribute('class', 'todo-item')

  const label = document.createElement('input')
  label.setAttribute('class', 'todo-label')
  label.addEventListener('blur', editTodo)

  if (task.title) {
    label.value = task.title
  }

  if (task.priority) {
    newTask.classList.add(priorities[task.priority].toLowerCase())
  }

  const marker = document.createElement('label')
  marker.setAttribute('class', 'marker')

  const checkbox = document.createElement('input')
  checkbox.setAttribute('type', 'checkbox')
  checkbox.setAttribute('class', 'toggle')
  checkbox.addEventListener('click', toggleTodo)

  const dueDateLabel = document.createElement('label')
  dueDateLabel.setAttribute('class', 'due-date')

  const expanderbox = document.createElement('div')
  expanderbox.setAttribute('class', 'expander-div')
  expanderbox.addEventListener('click', showMoreInfo)

  const downArrow = document.createElement('button')
  downArrow.setAttribute('class', 'expander')
  downArrow.innerText = '▾' // ◢

  expanderbox.appendChild(downArrow)

  div.appendChild(marker)
  div.appendChild(checkbox)
  div.appendChild(label)
  div.appendChild(expanderbox)
  div.appendChild(dueDateLabel)

  const elongatedDiv = document.createElement('div')
  elongatedDiv.setAttribute('class', 'elongated-div')
  elongatedDiv.classList.add('hidden')

  const notesDiv = document.createElement('div')
  notesDiv.setAttribute('class', 'notes-div')

  const noteslabel = document.createElement('label')
  noteslabel.setAttribute('class', 'notes-label')
  noteslabel.innerText = 'Notes'

  const textarea = document.createElement('textarea')
  textarea.setAttribute('class', 'notes')
  textarea.addEventListener('blur', getNotes)

  notesDiv.appendChild(noteslabel)
  notesDiv.appendChild(textarea)

  const priorityDiv = document.createElement('div')
  priorityDiv.setAttribute('class', 'priority-div')

  const dueDateTitle = document.createElement('label')
  dueDateTitle.innerText = 'Due Date'
  dueDateTitle.setAttribute('class', 'duedate-label')

  const datepicker = document.createElement('input')
  datepicker.setAttribute('type', 'date')
  datepicker.setAttribute('class', 'date-selector')
  datepicker.addEventListener('change', setDate)

  if (task.dueDate) {
    datepicker.setAttribute('value', task.dueDate)
  }

  const priorityLabel = document.createElement('label')
  priorityLabel.setAttribute('class', 'priority-label')
  priorityLabel.innerText = 'Priority'

  const prioritySelector = document.createElement('select')
  prioritySelector.setAttribute('class', 'priority-selector')
  prioritySelector.addEventListener('change', setPriority)

  for (let i = 0; i < priorities.length; i++) {
    const opt = document.createElement('option')
    opt.value = i
    opt.innerHTML = priorities[i]

    if (Number.isInteger(task.priority) && task.priority === i) {
      opt.setAttribute('selected', true)
    }
    prioritySelector.appendChild(opt)
  }

  const deleteButton = document.createElement('button')
  deleteButton.setAttribute('class', 'delete-button')
  deleteButton.innerText = 'Delete'
  deleteButton.addEventListener('click', deleteTodo)

  if (task.dueDate) {
    const timestamp = Date.parse(task.dueDate)
    const date = new Date(timestamp)
    dueDateLabel.innerText = (date.getDate() + '/' + (date.getMonth() + 1) + '/' + String(date.getFullYear()).slice(2))
  }

  priorityDiv.appendChild(dueDateTitle)
  priorityDiv.appendChild(datepicker)
  priorityDiv.appendChild(priorityLabel)
  priorityDiv.appendChild(prioritySelector)
  priorityDiv.appendChild(deleteButton)

  elongatedDiv.appendChild(notesDiv)
  elongatedDiv.appendChild(priorityDiv)

  if (task.completed) {
    checkbox.checked = true
    label.classList.add('strike')
  }

  if (task.notes) {
    textarea.innerText = task.notes
  }

  label.innerText = task.title
  marker.innerText = '≡'

  newTask.appendChild(div)
  newTask.appendChild(elongatedDiv)

  return newTask
}

function addTodo (event) {
  const input = document.getElementById('new-todo')
  const newTodo = Object.assign({}, model)
  const list = document.getElementById('todo-list')

  if (input.value && event.keyCode == 13) { // pressing Enter
    newTodo.id = Date.now()
    newTodo.title = input.value
    input.value = ''
    todos.push(newTodo)

    const li = makeTodo(newTodo)
    list.appendChild(li)

    syncLocalStorage()
  }
  toggleClearButton()
}

function toggleTodo (event) {
  const parent = event.target.parentElement.parentElement

  for (const todo of todos) {
    if (todo.id === Number(parent.id)) {
      todo.completed = !todo.completed

      if (todo.completed) {
        event.target.checked = true
        event.target.nextSibling.classList.add('strike')
      } else {
        event.target.checked = false
        event.target.nextElementSibling.classList.remove('strike')
      }
      syncLocalStorage()
      break
    }
  }

  toggleDoneTasks()
}

function deleteTodo (event) {
  const li = event.target.parentElement.parentElement.parentElement

  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === Number(li.id)) {
      todos.splice(i, 1)
      li.parentElement.removeChild(li)
      syncLocalStorage()
      break
    }
  }
  toggleClearButton()
}

function displayTodos (todos_ = todos) {
  const todoList = document.getElementById('todo-list')
  todoList.innerHTML = ''

  for (const task of todos_) {
    const li = makeTodo(task)
    todoList.appendChild(li)
  };

  toggleClearButton()
}

function editTodo (event) {
  const parent = event.target.parentElement.parentElement

  for (const task of todos) {
    if (task.id === Number(parent.id)) {
      task.title = event.target.value
      syncLocalStorage()
    }
  }
}

function showMoreInfo (event) {
  let parent = event.target.parentElement.parentElement

  if (event.target !== event.currentTarget) {
    parent = parent.parentElement
  }

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

function setDate (event) {
  const parent = event.target.parentElement.parentElement.parentElement
  const dateLabel = parent.querySelector('.due-date')
  for (const todo of todos) {
    if (todo.id === Number(parent.id)) {
      todo.dueDate = event.target.value

      if (event.target.value) {
        const timestamp = Date.parse(todo.dueDate)
        const date = new Date(timestamp)
        dateLabel.innerText = (date.getDate() + '/' + (date.getMonth() + 1) + '/' + String(date.getFullYear()).slice(2))
      } else {
        dateLabel.innerText = ''
      }

      syncLocalStorage()
      break
    }
  }
}

function setPriority (event) {
  const parent = event.target.parentElement.parentElement.parentElement

  for (const todo of todos) {
    if (todo.id === Number(parent.id)) {
      todo.priority = Number(event.target.value)

      for (const priority of priorities) {
        const priorityClass = priority.toLowerCase()
        // debugger;

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

function getNotes (event) {
  const parent = event.target.parentElement.parentElement.parentElement

  for (const todo of todos) {
    if (todo.id === Number(parent.id)) {
      todo.notes = event.target.value
      syncLocalStorage()
    }
  }
}

function syncLocalStorage (command) {
  const todoStore = window.localStorage

  switch (command) {
    case 'clear':
      todoStore.clear()
      todos = []
      break
    case 'init':
      todos = todoStore.length ? JSON.parse(todoStore.getItem('todos')) : []
      break
    default: todoStore.setItem('todos', JSON.stringify(todos))
  }
}

function clearAllTasks (event) {
  syncLocalStorage('clear')
  const list = document.getElementById('todo-list')
  list.innerHTML = ''
  toggleClearButton()
}

function toggleClearButton () {
  const clearTasks = document.getElementById('clear')

  if (todos.length) {
    clearTasks.style.visibility = 'visible'
  } else {
    clearTasks.style.visibility = 'hidden'
  }
}

function toggleDoneTasks () {
  const footer = document.querySelector('footer')
  const showTasksButton = document.querySelector('#toggle-done')

  const tempTodos = todos.filter(todo => !todo.completed)
  const completedTasksCount = todos.length - tempTodos.length

  if (completedTasksCount > 0) {
    footer.style.visibility = 'visible'
    toggleDoneState = !toggleDoneState

    if (toggleDoneState) {
      displayTodos(tempTodos)
      showTasksButton.innerHTML = `Show Done Tasks (${completedTasksCount})`
    } else {
      displayTodos(todos)
      showTasksButton.innerHTML = `Hide Done Tasks (${completedTasksCount})`
    }
  } else {
    footer.style.visibility = 'hidden'
  }
}

function clearDoneTasks () {
  todos = todos.filter(x => !x.completed)
  syncLocalStorage()
  displayTodos()
  toggleDoneTasks()
}

function main () {
  syncLocalStorage('init')
  displayTodos()
  toggleDoneTasks()
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
