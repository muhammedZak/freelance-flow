import { createAsyncThunk } from '@reduxjs/toolkit';

import authService from '../services/authService';

function getErrorMessage(error, fallbackMessage) {
  const responseMessage = error?.response?.data?.message;

  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage;
  }

  if (typeof error?.response?.data === 'string' && error.response.data.trim()) {
    return error.response.data;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return fallbackMessage;
}

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, thunkAPI) => {
    try {
      return await authService.checkAuth();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to restore your session.'),
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, thunkAPI) => {
    try {
      const session = await authService.login(credentials);

      return {
        user: session.user,
        accessToken: session.accessToken,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to log in.'),
      );
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, thunkAPI) => {
    try {
      return await authService.register(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to register.'),
      );
    }
  },
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, thunkAPI) => {
    try {
      return await authService.logout();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to complete logout.'),
      );
    }
  },
);
