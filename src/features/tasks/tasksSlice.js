import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import getApiErrorMessage from '@/shared/api/getApiErrorMessage';

import tasksService from './tasksService';

const ASYNC_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
});

function createOperationState() {
  return {
    status: ASYNC_STATUS.IDLE,
    error: null,
  };
}

function createRequestOperationState() {
  return {
    ...createOperationState(),
    currentRequestId: null,
  };
}

const initialState = {
  tasks: [],

  /*
   * Backward-compatible fetch-only flag.
   *
   * Create, update, and delete operations do not set
   * this flag, preventing them from activating initial
   * Task-list loading layouts.
   */
  loading: false,

  /*
   * Shared mutation flag for forms and Task controls.
   * Later selectors and orchestration Hooks can consume
   * this independently from fetch loading.
   */
  mutationLoading: false,

  error: null,
  successMessage: '',

  pendingFetchCount: 0,
  pendingMutationCount: 0,

  operations: {
    fetchAll: createOperationState(),

    fetchProject: createRequestOperationState(),

    create: createOperationState(),
    update: createOperationState(),
    delete: createOperationState(),
  },
};

function rejectRequest(rejectWithValue, error, fallbackMessage) {
  return rejectWithValue(getApiErrorMessage(error, fallbackMessage));
}

function isAbortError(error, signal) {
  return signal?.aborted || error?.name === 'AbortError';
}

function startOperation(operation) {
  operation.status = ASYNC_STATUS.LOADING;

  operation.error = null;
}

function completeOperation(operation) {
  operation.status = ASYNC_STATUS.SUCCEEDED;

  operation.error = null;
}

function failOperation(operation, error) {
  operation.status = ASYNC_STATUS.FAILED;

  operation.error = error;
}

function resetOperationError(operation) {
  operation.error = null;

  if (operation.status === ASYNC_STATUS.FAILED) {
    operation.status = ASYNC_STATUS.IDLE;
  }
}

function resetTaskOperationErrors(operations) {
  Object.values(operations).forEach((operation) => {
    resetOperationError(operation);
  });
}

function isCurrentProjectRequest(state, action) {
  return (
    state.operations.fetchProject.currentRequestId === action.meta.requestId
  );
}

function getRejectedMessage(action, fallbackMessage) {
  return action.payload || action.error?.message || fallbackMessage;
}

function decrementPendingFetches(state) {
  state.pendingFetchCount = Math.max(0, state.pendingFetchCount - 1);

  state.loading = state.pendingFetchCount > 0;
}

function decrementPendingMutations(state) {
  state.pendingMutationCount = Math.max(0, state.pendingMutationCount - 1);

  state.mutationLoading = state.pendingMutationCount > 0;
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

      return status !== ASYNC_STATUS.LOADING;
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

const isTaskFetchPending = isAnyOf(
  fetchTasks.pending,
  fetchTasksByProject.pending,
);

const isTaskFetchSettled = isAnyOf(
  fetchTasks.fulfilled,
  fetchTasks.rejected,
  fetchTasksByProject.fulfilled,
  fetchTasksByProject.rejected,
);

const isTaskMutationPending = isAnyOf(
  addTask.pending,
  editTask.pending,
  removeTask.pending,
);

const isTaskMutationSettled = isAnyOf(
  addTask.fulfilled,
  addTask.rejected,
  editTask.fulfilled,
  editTask.rejected,
  removeTask.fulfilled,
  removeTask.rejected,
);

const tasksSlice = createSlice({
  name: 'tasks',

  initialState,

  reducers: {
    clearTaskMessages: (state) => {
      state.error = null;
      state.successMessage = '';

      resetTaskOperationErrors(state.operations);
    },
  },

  extraReducers: (builder) => {
    builder
      /*
       * Fetch all Tasks
       */
      .addCase(fetchTasks.pending, (state) => {
        startOperation(state.operations.fetchAll);
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        completeOperation(state.operations.fetchAll);

        state.tasks = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        if (action.meta.condition) {
          return;
        }

        if (action.meta.aborted) {
          state.operations.fetchAll = createOperationState();

          return;
        }

        const errorMessage = getRejectedMessage(
          action,
          'Unable to load tasks.',
        );

        failOperation(state.operations.fetchAll, errorMessage);

        state.error = errorMessage;
      })

      /*
       * Fetch Tasks for one Project
       */
      .addCase(fetchTasksByProject.pending, (state, action) => {
        startOperation(state.operations.fetchProject);

        state.operations.fetchProject.currentRequestId = action.meta.requestId;
      })
      .addCase(fetchTasksByProject.fulfilled, (state, action) => {
        if (!isCurrentProjectRequest(state, action)) {
          return;
        }

        completeOperation(state.operations.fetchProject);

        state.operations.fetchProject.currentRequestId = null;

        state.tasks = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTasksByProject.rejected, (state, action) => {
        if (!isCurrentProjectRequest(state, action)) {
          return;
        }

        if (action.meta.aborted) {
          state.operations.fetchProject = createRequestOperationState();

          return;
        }

        const errorMessage = getRejectedMessage(
          action,
          'Unable to load project tasks.',
        );

        failOperation(state.operations.fetchProject, errorMessage);

        state.operations.fetchProject.currentRequestId = null;

        state.error = errorMessage;
      })

      /*
       * Create Task
       */
      .addCase(addTask.pending, (state) => {
        startOperation(state.operations.create);
      })
      .addCase(addTask.fulfilled, (state, action) => {
        completeOperation(state.operations.create);

        state.tasks.push(action.payload);

        state.successMessage = 'Task added successfully';
      })
      .addCase(addTask.rejected, (state, action) => {
        const errorMessage = getRejectedMessage(
          action,
          'Unable to create the task.',
        );

        failOperation(state.operations.create, errorMessage);

        state.error = errorMessage;
      })

      /*
       * Update Task or Task status
       */
      .addCase(editTask.pending, (state) => {
        startOperation(state.operations.update);
      })
      .addCase(editTask.fulfilled, (state, action) => {
        completeOperation(state.operations.update);

        state.tasks = state.tasks.map((task) =>
          String(task.id) === String(action.payload.id) ? action.payload : task,
        );

        state.successMessage = 'Task updated successfully';
      })
      .addCase(editTask.rejected, (state, action) => {
        const errorMessage = getRejectedMessage(
          action,
          'Unable to update the task.',
        );

        failOperation(state.operations.update, errorMessage);

        state.error = errorMessage;
      })

      /*
       * Delete Task
       */
      .addCase(removeTask.pending, (state) => {
        startOperation(state.operations.delete);
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        completeOperation(state.operations.delete);

        const deletedTaskId = String(action.payload);

        state.tasks = state.tasks.filter(
          (task) => String(task.id) !== deletedTaskId,
        );

        state.successMessage = 'Task deleted successfully';
      })
      .addCase(removeTask.rejected, (state, action) => {
        const errorMessage = getRejectedMessage(
          action,
          'Unable to delete the task.',
        );

        failOperation(state.operations.delete, errorMessage);

        state.error = errorMessage;
      })

      /*
       * Shared fetch-state mapping
       */
      .addMatcher(isTaskFetchPending, (state) => {
        state.pendingFetchCount += 1;
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isTaskFetchSettled, (state, action) => {
        /*
         * A condition-rejected fetch never emitted
         * a pending action, so there is no pending
         * counter to decrement.
         */
        if (action.meta?.condition) {
          return;
        }

        decrementPendingFetches(state);
      })

      /*
       * Shared mutation-state mapping
       */
      .addMatcher(isTaskMutationPending, (state) => {
        state.pendingMutationCount += 1;
        state.mutationLoading = true;

        state.error = null;
        state.successMessage = '';
      })
      .addMatcher(isTaskMutationSettled, (state) => {
        decrementPendingMutations(state);
      });
  },
});

export const { clearTaskMessages } = tasksSlice.actions;

export default tasksSlice.reducer;
