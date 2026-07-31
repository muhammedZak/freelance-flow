import { createAsyncThunk } from '@reduxjs/toolkit';

import getApiErrorMessage from '@/shared/api/getApiErrorMessage';

import projectsService from './projectsService';

function rejectRequest(rejectWithValue, error, fallbackMessage) {
  return rejectWithValue(getApiErrorMessage(error, fallbackMessage));
}

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      return await projectsService.getProjects();
    } catch (error) {
      return rejectRequest(rejectWithValue, error, 'Unable to load projects.');
    }
  },
  {
    condition: (_, { getState }) => {
      const listStatus = getState().projects?.operations?.fetchList?.status;

      return listStatus !== 'loading';
    },
  },
);

export const fetchProjectById = createAsyncThunk(
  'projects/fetchProjectById',
  async (id, { rejectWithValue }) => {
    try {
      return await projectsService.getProjectById(id);
    } catch (error) {
      return rejectRequest(
        rejectWithValue,
        error,
        'Unable to load the project.',
      );
    }
  },
);

export const addProject = createAsyncThunk(
  'projects/addProject',
  async (projectData, { rejectWithValue }) => {
    try {
      return await projectsService.createProject(projectData);
    } catch (error) {
      return rejectRequest(
        rejectWithValue,
        error,
        'Unable to create the project.',
      );
    }
  },
);

export const editProject = createAsyncThunk(
  'projects/editProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      return await projectsService.updateProject(id, projectData);
    } catch (error) {
      return rejectRequest(
        rejectWithValue,
        error,
        'Unable to update the project.',
      );
    }
  },
);

export const removeProject = createAsyncThunk(
  'projects/removeProject',
  async (id, { rejectWithValue }) => {
    try {
      return await projectsService.deleteProject(id);
    } catch (error) {
      return rejectRequest(
        rejectWithValue,
        error,
        'Unable to delete the project.',
      );
    }
  },
);
