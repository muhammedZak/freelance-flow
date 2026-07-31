import { createAsyncThunk } from '@reduxjs/toolkit';

import getApiErrorMessage from '@/shared/api/getApiErrorMessage';

import tasksService from './tasksService';

const LOADING_STATUS = 'loading';

function rejectRequest(rejectWithValue, error, fallbackMessage) {
  return rejectWithValue(getApiErrorMessage(error, fallbackMessage));
}

function isAbortError(error, signal) {
  return signal?.aborted || error?.name === 'AbortError';
}

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_, { rejectWithValue, signal }) => {
    try {
      return await tasksService.getTasks({
        signal,
      });
    } catch (error) {
      if (isAbortError(error, signal)) {
        throw error;
      }

      return rejectRequest(rejectWithValue, error, 'Unable to load tasks.');
    }
  },
  {
    condition: (_, { getState }) => {
      const status = getState().tasks?.operations?.fetchAll?.status;

      return status !== LOADING_STATUS;
    },
  },
);

export const fetchTasksByProject = createAsyncThunk(
  'tasks/fetchTasksByProject',
  async (projectId, { rejectWithValue, signal }) => {
    try {
      return await tasksService.getTasksByProject(projectId, {
        signal,
      });
    } catch (error) {
      if (isAbortError(error, signal)) {
        throw error;
      }

      return rejectRequest(
        rejectWithValue,
        error,
        'Unable to load project tasks.',
      );
    }
  },
);

export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (taskData, { rejectWithValue }) => {
    try {
      return await tasksService.createTask(taskData);
    } catch (error) {
      return rejectRequest(
        rejectWithValue,
        error,
        'Unable to create the task.',
      );
    }
  },
);

export const editTask = createAsyncThunk(
  'tasks/editTask',
  async ({ id, taskData }, { rejectWithValue }) => {
    try {
      return await tasksService.updateTask(id, taskData);
    } catch (error) {
      return rejectRequest(
        rejectWithValue,
        error,
        'Unable to update the task.',
      );
    }
  },
);

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (id, { rejectWithValue }) => {
    try {
      return await tasksService.deleteTask(id);
    } catch (error) {
      return rejectRequest(
        rejectWithValue,
        error,
        'Unable to delete the task.',
      );
    }
  },
);
