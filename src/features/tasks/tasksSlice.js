import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import tasksService from './tasksService';

const initialState = {
  tasks: [],
  loading: false,
  error: null,
  successMessage: '',
};

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, thunkAPI) => {
    try {
      return await tasksService.getTasks();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchTasksByProject',
  async (projectId, thunkAPI) => {
    try {
      return await tasksService.getTasksByProject(projectId);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskData, thunkAPI) => {
    try {
      return await tasksService.createTask(taskData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const editTask = createAsyncThunk(
  'tasks/editTask',
  async ({ id, taskData }, thunkAPI) => {
    try {
      return await tasksService.updateTask(id, taskData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (id, thunkAPI) => {
    try {
      return await tasksService.deleteTask(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTaskMessages: (state) => {
      state.error = null;
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchTasksByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
        state.successMessage = 'Task added successfully';
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(editTask.fulfilled, (state, action) => {
        state.loading = false;

        state.tasks = state.tasks.map((task) =>
          String(task.id) === String(action.payload.id) ? action.payload : task,
        );

        state.successMessage = 'Task updated successfully';
      })
      .addCase(editTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.loading = false;

        state.tasks = state.tasks.filter(
          (task) => String(task.id) !== String(action.payload),
        );

        state.successMessage = 'Task deleted successfully';
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearTaskMessages } = tasksSlice.actions;

export default tasksSlice.reducer;
