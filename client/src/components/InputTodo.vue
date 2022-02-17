<template>
    <div>
      <label>+ </label>
      <input v-model="newTodo" @keydown.enter="submitInput" placeholder="New task...">
    </div>
</template>

<script>
export default {
  name: 'InputTodo',
  data() {
      return {
          'newTodo': ''
        }
    },
  methods: {
      submitInput() {
         const todo = {
            title: this.newTodo,
            completed: false,
            priority: 0,
            dueDate: '',
            notes: ''
         }
         this.newTodo = ''
         this.$emit('recieve-todo', todo )
      }
    }
}
</script>

<style scoped>

div {
  background-color: #ffffff;
  padding: 10px 20px;
  width: 100%;
  border: 2px solid;
  border-color: #aebdcb;
  border-radius: 3px;
  margin-top: 20px;
  margin-bottom: 150px;
}


div:hover {
  border-color: #f6b7a3;
  border-radius: 1.5px;
}

input {
    
  padding: 0;
  border: none;
  background: #ffffff;
  width: 90%;
  margin-top: 0;
  margin-bottom: 0;
  outline: none;
}

label {
  color: #727272; 
}

label:hover {
  color: #000000;
}

</style>
