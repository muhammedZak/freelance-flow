import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import projectsService from './projectsService';

const ASYNC_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
};

const createOperationState = () => ({
  status: ASYNC_STATUS.IDLE,
  error: null,
});

const initialState = {
  projects: [],
  selectedProject: null,

  operations: {
    fetchList: createOperationState(),
    fetchDetails: createOperationState(),
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

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, thunkAPI) => {
    try {
      return await projectsService.getProjects();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const status = getState().projects?.operations?.fetchList?.status;

      return status !== ASYNC_STATUS.LOADING;
    },
  },
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, thunkAPI) => {
    try {
      return await projectsService.getProjectById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addProject = createAsyncThunk(
  'projects/addProject',
  async (projectData, thunkAPI) => {
    try {
      return await projectsService.createProject(projectData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const editProject = createAsyncThunk(
  'projects/editProject',
  async ({ id, projectData }, thunkAPI) => {
    try {
      return await projectsService.updateProject(id, projectData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const removeProject = createAsyncThunk(
  'projects/removeProject',
  async (id, thunkAPI) => {
    try {
      return await projectsService.deleteProject(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

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
      state.operations.fetchDetails = createOperationState();
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
          action.payload || 'Failed to fetch projects',
        );
      })

      .addCase(fetchProjectById.pending, (state) => {
        startOperation(state.operations.fetchDetails);
        state.selectedProject = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        completeOperation(state.operations.fetchDetails);
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        failOperation(
          state.operations.fetchDetails,
          action.payload || 'Failed to fetch project',
        );
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
          action.payload || 'Failed to create project',
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
          action.payload || 'Failed to update project',
        );
      })

      .addCase(removeProject.pending, (state) => {
        startOperation(state.operations.delete);
        state.successMessage = '';
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.loading = false;

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
          action.payload || 'Failed to delete project',
        );
      });
  },
});

export const { clearProjectMessages, clearSelectedProject } =
  projectsSlice.actions;

export default projectsSlice.reducer;
