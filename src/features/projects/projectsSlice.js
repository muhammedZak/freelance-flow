import { createSlice } from '@reduxjs/toolkit';

import {
  addProject,
  editProject,
  fetchProjectById,
  fetchProjects,
  removeProject,
} from './projectsThunks';

const ASYNC_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
});

const createOperationState = () => ({
  status: ASYNC_STATUS.IDLE,
  error: null,
});

const createDetailsOperationState = () => ({
  ...createOperationState(),
  currentRequestId: null,
});

const initialState = {
  projects: [],
  selectedProject: null,

  operations: {
    fetchList: createOperationState(),
    fetchDetails: createDetailsOperationState(),
    create: createOperationState(),
    update: createOperationState(),
    delete: createOperationState(),
  },

  successMessage: '',
};

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

function resetOperationErrors(operations) {
  Object.values(operations).forEach((operation) => {
    operation.error = null;

    if (operation.status === ASYNC_STATUS.FAILED) {
      operation.status = ASYNC_STATUS.IDLE;
    }
  });
}

function isCurrentDetailsRequest(state, action) {
  return (
    state.operations.fetchDetails.currentRequestId === action.meta.requestId
  );
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,

  reducers: {
    clearProjectMessages: (state) => {
      resetOperationErrors(state.operations);
      state.successMessage = '';
    },

    clearSelectedProject: (state) => {
      state.selectedProject = null;
      state.operations.fetchDetails = createDetailsOperationState();
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        startOperation(state.operations.fetchList);
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        completeOperation(state.operations.fetchList);
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        if (action.meta.condition) {
          return;
        }

        failOperation(
          state.operations.fetchList,
          action.payload || 'Unable to load projects.',
        );
      })

      .addCase(fetchProjectById.pending, (state, action) => {
        startOperation(state.operations.fetchDetails);
        state.operations.fetchDetails.currentRequestId = action.meta.requestId;
        state.selectedProject = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        if (!isCurrentDetailsRequest(state, action)) {
          return;
        }

        completeOperation(state.operations.fetchDetails);
        state.operations.fetchDetails.currentRequestId = null;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        if (!isCurrentDetailsRequest(state, action)) {
          return;
        }

        if (action.meta.aborted) {
          state.operations.fetchDetails = createDetailsOperationState();
          state.selectedProject = null;
          return;
        }

        failOperation(
          state.operations.fetchDetails,
          action.payload || 'Unable to load the project.',
        );
        state.operations.fetchDetails.currentRequestId = null;
        state.selectedProject = null;
      })

      .addCase(addProject.pending, (state) => {
        startOperation(state.operations.create);
        state.successMessage = '';
      })
      .addCase(addProject.fulfilled, (state, action) => {
        completeOperation(state.operations.create);
        state.projects.push(action.payload);
        state.successMessage = 'Project added successfully';
      })
      .addCase(addProject.rejected, (state, action) => {
        failOperation(
          state.operations.create,
          action.payload || 'Unable to create the project.',
        );
      })

      .addCase(editProject.pending, (state) => {
        startOperation(state.operations.update);
        state.successMessage = '';
      })
      .addCase(editProject.fulfilled, (state, action) => {
        completeOperation(state.operations.update);

        state.projects = state.projects.map((project) =>
          String(project.id) === String(action.payload.id)
            ? action.payload
            : project,
        );

        state.selectedProject = action.payload;
        state.successMessage = 'Project updated successfully';
      })
      .addCase(editProject.rejected, (state, action) => {
        failOperation(
          state.operations.update,
          action.payload || 'Unable to update the project.',
        );
      })

      .addCase(removeProject.pending, (state) => {
        startOperation(state.operations.delete);
        state.successMessage = '';
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        completeOperation(state.operations.delete);

        const deletedProjectId = String(action.payload);

        state.projects = state.projects.filter(
          (project) => String(project.id) !== deletedProjectId,
        );

        if (
          state.selectedProject &&
          String(state.selectedProject.id) === deletedProjectId
        ) {
          state.selectedProject = null;
        }

        state.successMessage = 'Project deleted successfully';
      })
      .addCase(removeProject.rejected, (state, action) => {
        failOperation(
          state.operations.delete,
          action.payload || 'Unable to delete the project.',
        );
      });
  },
});

export {
  addProject,
  editProject,
  fetchProjectById,
  fetchProjects,
  removeProject,
} from './projectsThunks';

export const { clearProjectMessages, clearSelectedProject } =
  projectsSlice.actions;

export default projectsSlice.reducer;
