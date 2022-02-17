<template>
<li  :class="styleClass">

  <div class="todo-item">
      <label class="marker">≡</label>
      <input type="checkbox" class="toggle" v-model="completed" @change="updateTodo"/>
      <input class="todo-label" :class="{ strike: completed }" v-model="title" @blur="updateTodo" />
      <div class="expander-div" @click="toggleElongated">
        <button v-if="elongatedVisible" class="expander">▴</button>
        <button v-else class="expander">▾</button>
      </div>
      <label class="due-date">{{shortDate}}</label>
  </div>

  <div v-show="elongatedVisible" class="elongated-div">

    <div class="notes-div">
        <label class="notes-label">Notes</label>
        <textarea class="notes" v-model="notes" @blur="updateTodo" ></textarea>
    </div>
    
    <div class="priority-div">
        <label class="duedate-label">Due Date</label>
        <input type="date" class="date-selector" v-model="dueDate" @change="updateTodo" >
        <label class="priority-label">Priority</label>
        <select class="priority-selector" v-model="priority" @change="updateTodo">
            <option v-for="(priority, index) in priorities" :value="index" :key="index">{{ priority }}</option>
        </select>
        <button class="delete-button" @click="deleteTodo" >Delete</button>
    </div>
  </div>
</li>
</template>

<script>


export default {
  name: 'TodoItem',
  props: {
    todo: Object
  },
  data() {
      return {
          'id': '',
          'title': '',
          'completed': '',
          'notes': '',
          'dueDate': '',
          'priority': null,
          'elongatedVisible': false,
          'priorities': ['None', 'Low', 'Medium', 'High'],
        }
    },
    computed: {
      shortDate() {
          const date = new Date(Date.parse(this.dueDate))
          if(this.dueDate) {
                return (date.getDate() + '/' + (date.getMonth() + 1) + '/' + String(date.getFullYear()).slice(2))
          }
          return ''
        },
      styleClass() {
          return this.priorities[this.priority].toLowerCase()
        }
      },
    methods: {
        toggleElongated() {
            this.elongatedVisible = !this.elongatedVisible
        },
        updateTodo() {
           let todo = {
             id: this.id,
             title : this.title,
             completed : this.completed,
             notes : this.notes,
             priority : this.priority,
             dueDate : this.dueDate
           }
           this.$emit('update-todo', todo) 
       },
       deleteTodo() {
            this.$emit('delete-todo', this.todo.id )
      },
       debug() {
          console.log('damn son')
       }
    },
    created() {
        this.id = this.todo.id
        this.title = this.todo.title
        this.completed = this.todo.completed
        this.notes = this.todo.notes
        this.dueDate = this.todo.dueDate
        this.priority = this.todo.priority
      }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

li {
  list-style-type: none;
  padding: 10px 20px;
  margin-bottom: 2.5px;
  width: 100%;
  background-color: #ffffff;
  border: 2px solid ;
  border-left: 3px solid;
  border-color: #aebdcb;
  border-radius: 3px;
}
.toggle {
  margin-left: 10px;
  margin-right: 13px;
  color: #727272;
  padding: 2px;
  border: 2px solid #ffffff;
}

.todo-label {
  border: 2px solid #ffffff;
  outline: none;
  width: 70%;
  
}

.expander {
  border: 2px solid #ffffff;
  background-color: #ffffff;
  transform: scale(2,1); 
  font-size: 0.6em;
  padding:0;
  margin: auto 30%;
  position: absolute;
  bottom: 2px; 
}

.expander-div {
  float:right;
  width: 20px;
  height: 15px;
  /* padding-left: 2px; */
  border: 2px solid #ffffff;
  padding-bottom: 5px;
  position: relative;
}

.expander-div:hover {
  border: 2px solid #f6b7a3;
  border-radius: 4px;
}

.due-date {
  float: right;
  margin-right: 5px;
  margin-top: 2.5px;
  font-size: 0.8em;
}

.marker, .due-date, #plus {
  color: #727272;
}

.elongated-div {
  height: 250px;
  background-color: #ffffff;
  border-top: 1px solid;
  border-color: #cacaca;
  margin-top: 10px;

}

.strike {
  text-decoration: line-through;
  color: #aaaaaa;
}

#plus:hover {
  color: #000000;
}

.notes-label, .duedate-label, .priority-label {
  display: block;
  color: #666666;
  margin-top: 7px;
  margin-bottom: 7px;
  font-size: 0.9em;
}

.elongated-div div {
  height: inherit;
  float: left;
}

.notes-div {
  width: 60%;
}

.priority-div {
  width: 40%;
  position:relative;
}
 
.notes {
  width: 94%; 
  height: 80%;
  resize: none;
  outline-style: none;
  outline: none !important;
  border: 1px groove #cccccc;
  border-radius: 2px;
}

.notes:hover {
  border-color: #f6b7a3;
}

.date-selector {
  width: 100%; 
  height: 12%;
  outline: none !important;
  border: 1px groove #cccccc;
  border-radius: 2px;
  color: #444444;
}

.priority-selector {
  width: 102.13%; 
  height: 13.33%;
  outline-style: none;
  outline: none !important;
  border: 1px groove #cccccc;
  border-radius: 2px;
  color: #444444;
  background-color: #ffffff; 
}

.priority-label {
  margin-top: 20px;
}

.delete-button {
  width: 80px;
  height: 35px;
  background-color: #d0172d;
  color: #eeeeee;
  border: 0.5px solid #b14451;
  border-radius: 4px;
  right: -5px;
  bottom:12px;
  font-weight: normal;
  position: absolute;
}

.delete-button:hover {
  color: #ffffff;
  box-shadow : 1px 1px 1px #555555;
}

.none {
  border-left: 3px solid #aebdcb !important;
}

.low {
  border-left: 3px solid purple !important;
}

.medium {
  border-left: 3px solid orange !important;
}

.high {
  border-left: 3px solid #d0172d !important;
}
</style>
