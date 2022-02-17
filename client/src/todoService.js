import axios from "axios"

// const BASE_URL = 'http://localhost:3000/api/todos'
const BASE_URL = '/api/todos'

class TodoService {
  static async getTodos() {
    try {
      const response = await axios.get(BASE_URL) //use data destructuring to get data from the promise object
      return response.data
    }

    catch (error) {
      console.log(error);
    }

  }

  static async putTodo(todo) {
    try {
      const response = await axios.post(BASE_URL, todo) //use data destructuring to get data from the promise object
      return response.data
    }

    catch (error) {
      console.log(error);
    }

  }

  static updateTodo(todo) {
    console.log(todo)
    return axios.put(`${BASE_URL}/${todo.id}`, todo)
  }

  static deleteTodo(todoID) {
    return axios.delete(`${BASE_URL}/${todoID}`)
  }

  static deleteAllTodos() {
    return axios.delete(`${BASE_URL}`)
  }

  static deleteCompletedTodos() {
    return axios.delete(`${BASE_URL}Completed`)
  }
}

export default TodoService


