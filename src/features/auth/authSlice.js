import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authSerivce from './authService';

function getUserFromLocalStorage() {
  const savedUser = localStorage.getItem('freelanceflow_user');

  if (savedUser) {
    return JSON.parse(savedUser);
  }

  return null;
}

const initialState = {
  user: getUserFromLocalStorage(),
  isAuthenticated: Boolean(getUserFromLocalStorage()),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, thunkApi) => {
    try {
      return await authSerivce.login(userData);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  },
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, thunkApi) => {
    try {
      return await authSerivce.register(userData);
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      authSerivce.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { logoutUser, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
