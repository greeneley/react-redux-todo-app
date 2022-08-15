import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getTodosAsync = createAsyncThunk(
  "todos/getTodosAsync",
  async () => {
    const response = await fetch("http://localhost:7000/todos");
    if (response.ok) {
      const todos = await response.json();
      return { todos };
    }
  }
);

export const addTodosAsync = createAsyncThunk(
  "todos/addTodosAsync",
  async (payload) => {
    const config = {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        title: payload.title,
      }),
    };
    const response = await fetch("http://localhost:7000/todos", config);
    if (response.ok) {
      const todo = await response.json();
      return { todo };
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: [],
  reducers: {
    addTodo: (state, action) => {
      const newTodo = {
        id: Date.now(),
        title: action.payload.title,
        completed: false,
      };
      state.push(newTodo);
    },
    toggleComplete: (state, action) => {
      const index = state.findIndex((todo) => todo.id === action.payload.id);
      state[index].completed = action.payload.completed;
    },
    todoDelete: (state, action) => {
      return state.filter((todo) => todo.id !== action.payload.id);
    },
  },
  extraReducers: {
    [getTodosAsync.pending]: (state, action) => {
      console.log("fetching data...");
    },
    [getTodosAsync.fulfilled]: (state, action) => {
      console.log("fetched data successfully!");
      return action.payload.todos;
    },
    [addTodosAsync.fulfilled]: (state, action) => {
      state.push(action.payload.todo);
    },
  },
});

export const { addTodo, toggleComplete, todoDelete } = todoSlice.actions;

export default todoSlice.reducer;