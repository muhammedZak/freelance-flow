import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import projectsService from './projectsService';

const initialState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
  successMessage: '',
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, thunkAPI) => {
    try {
      return await projectsService.getProjects();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, thunkAPI) => {
    try {
      return await projectsService.getProjectById(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

export const addProject = createAsyncThunk(
  'projects/addProject',
  async (projectData, thunkAPI) => {
    try {
      return await projectsService.createProject(projectData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

export const editProject = createAsyncThunk(
  'projects/editProject',
  async ({ id, projectData }, thunkAPI) => {
    try {
      return await projectsService.updateProject(id, projectData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

export const removeProject = createAsyncThunk(
  'projects/removeProject',
  async (id, thunkAPI) => {
    try {
      return await projectsService.deleteProject(id);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  },
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectMessages: (state) => {
      state.error = null;
      state.successMessage = '';
    },
    clearSelectedProject: (state) => {
      state.selectedProject = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedProject = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedProject = null;
      })

      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(addProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
        state.successMessage = 'Project added successfully';
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(editProject.fulfilled, (state, action) => {
        state.loading = false;

        state.projects = state.projects.map((project) =>
          project.id === action.payload.id ? action.payload : project,
        );

        state.selectedProject = action.payload;
        state.successMessage = 'Project updated successfully';
      })
      .addCase(editProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.loading = false;

        state.projects = state.projects.filter(
          (project) => project.id !== action.payload,
        );

        state.successMessage = 'Project deleted successfully';
      })
      .addCase(removeProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProjectMessages, clearSelectedProject } =
  projectsSlice.actions;

export default projectsSlice.reducer;
