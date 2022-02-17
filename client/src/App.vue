<template>
  <TodoList :todos="effectiveTodos"  
      @delete-todo="deleteTodo"
      @update-todo="updateTodo"
  />
  <InputTodo 
      @recieve-todo="addTodo"

  />
  <Footer 
    :todos="todos"
    :visibility="visibility"
    @clear-all="deleteMultiple"
    @clear-completed="deleteMultiple"
    @toggle="toggleVisibility"
  />
</template>

<script>
import TodoList from './components/TodoList.vue'
import InputTodo  from './components/InputTodo.vue'
import Footer  from './components/Footer.vue'

import TodoService from './todoService.js'

export default {
  name: 'App',
  components: {
    TodoList,
    InputTodo,
    Footer
  },
  data() {
      return {
          "todos": [],
          "visibility": "completed",
        }
    },
  async created() {
    this.todos = await TodoService.getTodos()
  },
  methods: {
    async addTodo(todo) {
      const newTodo = await TodoService.putTodo(todo)
      this.todos.push(newTodo)
      },

      updateTodo(todo) {

       console.log(todo) 
       const response = TodoService.updateTodo(todo)
       response.then( this.todos = this.todos.map(t => (t.id === todo.id ? todo: t)))

      },

      deleteTodo(todoID) {
        const response = TodoService.deleteTodo(todoID)
        response.then(this.todos = this.todos.filter(todo => todo.id !== todoID))
      },

      deleteMultiple(type) {
        let response
        switch(type) {
            case 'all':
               response = TodoService.deleteAllTodos()
               response.then(this.todos = [])
               break
            case 'completed':
               response = TodoService.deleteCompletedTodos()
               response.then(this.todos = this.todos.filter(todo => !todo.completed))
               break
          }
        console.log(response)
      },
      toggleVisibility() {
          if (this.visibility === 'all') {
              this.visibility = 'completed'
            }
          else {
              this.visibility = 'all'
            }
        }
    },
    computed: {
      effectiveTodos() {
        if(this.visibility === 'all'){
          return this.todos
          }
        else {
            return this.todos.filter(todo => !todo.completed)
          }
        },
     completedTodos() {
         return this.todos.filter(todo => todo.completed).length > 0
     }
  }
}

</script>

<style>

#app {
  margin: auto 30%;
}

</style>
