<template>
  <!-- <footer v-show="checked" :class="{ 'empty-border': !checked}" > -->
  <footer v-show="checked" >
    <div class="done-task-div"> 
        <button id="toggle-done" @click="toggle">{{tasksLegend}}</button>
        <button id="clear-done" @click="clearDone">Clear Done Tasks</button>
    </div>
  </footer>
    <button v-show="todos.length > 0" id="clear" @click="clearAll">Clear All Tasks</button>
</template>

<script>
export default {
  name: 'Footer',
  props: {
    todos: Object,
    visibility: String
  },
  methods: {
      clearAll() {
          this.$emit('clear-all', 'all')
        },
      clearDone() {
          this.$emit('clear-completed', 'completed')
        },
      toggle() {
          this.$emit('toggle')
        },
      todosCompleted() {
          return this.todos.filter(todo => todo.completed).length
        }
    },
    computed: {
      tasksLegend() {
          if(this.visibility === 'all') {
           return  `Hide Done Tasks (${this.todosCompleted()})`
          } else {
           return  `Show Done Tasks (${this.todosCompleted()})`
           }
        },
      checked() {
          return this.todosCompleted() > 0
        }
    }
}
</script>

<style scoped>

footer {
  position: fixed;
  box-sizing: border-box;
  bottom: 15px;     
  left: 0px;
  padding: 15px;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  background-color: #ffffff;
  border: 2px solid #aebdcb;
  
}

.empty-border {
  border: none;
  background-color: #becedd;
}

#clear, #clear-done, #toggle-done {
  padding: 12px;
  width: fit-content;
  border: 2px solid #aebdcb;
  background-color: #ffffff;
  border-radius: 3px;
  color: #555555;
  font-weight: 501;
}

#clear:hover, #toggle-done:hover, #clear-done:hover{
  border-color: #f6b7a3;
  color: #000000;
}

#clear {

  position: fixed;
  right: 17px;
  bottom: 32px;
}

#toggle-done {
  margin-left: 670px;
  width: 450px;
}
</style>
