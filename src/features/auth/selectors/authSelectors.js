const ASYNC_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
});

const selectAuthState = (state) => state.auth;

export const selectCurrentUser = (state) => selectAuthState(state).session.user;

export const selectAuthUser = selectCurrentUser;

export const selectAuthAccessToken = (state) =>
  selectAuthState(state).session.accessToken;

export const selectIsAuthenticated = (state) =>
  Boolean(selectCurrentUser(state));

export const selectCheckAuthStatus = (state) =>
  selectAuthState(state).checkAuth.status;

export const selectCheckAuthError = (state) =>
  selectAuthState(state).checkAuth.error;

export const selectIsCheckingAuth = (state) =>
  selectCheckAuthStatus(state) === ASYNC_STATUS.LOADING;

export const selectIsAuthInitialized = (state) => {
  const status = selectCheckAuthStatus(state);

  return status === ASYNC_STATUS.SUCCEEDED || status === ASYNC_STATUS.FAILED;
};

export const selectLoginStatus = (state) => selectAuthState(state).login.status;

export const selectLoginError = (state) => selectAuthState(state).login.error;

export const selectIsLoginLoading = (state) =>
  selectLoginStatus(state) === ASYNC_STATUS.LOADING;

export const selectRegistrationStatus = (state) =>
  selectAuthState(state).registration.status;

export const selectRegistrationError = (state) =>
  selectAuthState(state).registration.error;

export const selectIsRegistrationLoading = (state) =>
  selectRegistrationStatus(state) === ASYNC_STATUS.LOADING;

export const selectLogoutStatus = (state) =>
  selectAuthState(state).logout.status;

export const selectLogoutError = (state) => selectAuthState(state).logout.error;

export const selectIsLogoutLoading = (state) =>
  selectLogoutStatus(state) === ASYNC_STATUS.LOADING;
