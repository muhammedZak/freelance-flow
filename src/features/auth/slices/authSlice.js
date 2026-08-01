import { createSlice } from '@reduxjs/toolkit';

import {
  checkAuth,
  loginUser,
  logoutUser,
  registerUser,
} from '../thunks/authThunks';

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

function startOperation(operation) {
  operation.status = ASYNC_STATUS.LOADING;
  operation.error = null;
}

function completeOperation(operation) {
  operation.status = ASYNC_STATUS.SUCCEEDED;
  operation.error = null;
}

function failOperation(operation, errorMessage) {
  operation.status = ASYNC_STATUS.FAILED;
  operation.error = errorMessage;
}

const initialState = {
  session: {
    user: null,
    accessToken: null,
  },

  checkAuth: createOperationState(),
  login: createOperationState(),
  registration: createOperationState(),
  logout: createOperationState(),
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    clearAuthErrors: (state) => {
      state.checkAuth.error = null;
      state.login.error = null;
      state.registration.error = null;
      state.logout.error = null;

      if (state.login.status === ASYNC_STATUS.FAILED) {
        state.login.status = ASYNC_STATUS.IDLE;
      }

      if (state.registration.status === ASYNC_STATUS.FAILED) {
        state.registration.status = ASYNC_STATUS.IDLE;
      }

      if (state.logout.status === ASYNC_STATUS.FAILED) {
        state.logout.status = ASYNC_STATUS.IDLE;
      }
    },

    resetRegistrationState: (state) => {
      state.registration = createOperationState();
    },
  },

  extraReducers: (builder) => {
    builder
      // -------------------------
      // Check authentication
      // -------------------------
      .addCase(checkAuth.pending, (state) => {
        startOperation(state.checkAuth);
      })

      .addCase(checkAuth.fulfilled, (state, action) => {
        completeOperation(state.checkAuth);

        state.session.user = action.payload.user;

        state.session.accessToken = action.payload.accessToken;
      })

      .addCase(checkAuth.rejected, (state, action) => {
        failOperation(
          state.checkAuth,
          action.payload || 'Unable to restore your session.',
        );

        state.session.user = null;
        state.session.accessToken = null;
      })

      // -------------------------
      // Login
      // -------------------------
      .addCase(loginUser.pending, (state) => {
        startOperation(state.login);
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        completeOperation(state.login);

        state.session.user = action.payload.user;

        state.session.accessToken = action.payload.accessToken;
      })

      .addCase(loginUser.rejected, (state, action) => {
        failOperation(state.login, action.payload || 'Unable to log in.');

        state.session.user = null;
        state.session.accessToken = null;
      })

      // -------------------------
      // Registration
      // -------------------------
      .addCase(registerUser.pending, (state) => {
        startOperation(state.registration);
      })

      .addCase(registerUser.fulfilled, (state) => {
        completeOperation(state.registration);
      })

      .addCase(registerUser.rejected, (state, action) => {
        failOperation(
          state.registration,
          action.payload || 'Unable to register.',
        );
      })

      // -------------------------
      // Logout
      // -------------------------
      .addCase(logoutUser.pending, (state) => {
        startOperation(state.logout);
      })

      .addCase(logoutUser.fulfilled, (state) => {
        completeOperation(state.logout);

        state.session.user = null;
        state.session.accessToken = null;

        state.login = createOperationState();

        state.registration = createOperationState();
      })

      .addCase(logoutUser.rejected, (state, action) => {
        failOperation(
          state.logout,
          action.payload || 'Unable to complete logout.',
        );

        state.session.user = null;
        state.session.accessToken = null;

        state.login = createOperationState();

        state.registration = createOperationState();
      });
  },
});

export const { clearAuthErrors, resetRegistrationState } = authSlice.actions;

export default authSlice.reducer;
