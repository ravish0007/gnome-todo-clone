<template>
  <div class="hello">
    <ul>
    <TodoItem v-for="todo in todos" :todo="todo" :key="todo.id" @update-todo="updateTodo" @delete-todo="deleteTodo"/>
    </ul>
  </div>
</template>

<script>

import TodoItem from './TodoItem.vue'

export default {
  name: 'TodoList',
  props: {
    todos: Array
  },
  methods: {
    deleteTodo(id) {
        this.$emit('delete-todo', id)
    },
    updateTodo(todo) {
        this.$emit('update-todo', todo)
      }
  },
  components: {
      TodoItem
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

ul {
  padding: 0;
  margin-top: 20px;
}
</style>
