import axios from 'axios';

const API_URL = 'http://localhost:3000';
const AUTH_SESSION_STORAGE_KEY = 'freelanceflow_auth_session';

function getStoredAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedSession = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!storedSession) {
    return null;
  }

  try {
    const session = JSON.parse(storedSession);
    const accessToken = session?.accessToken;

    return typeof accessToken === 'string' && accessToken.trim()
      ? accessToken.trim()
      : null;
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
}

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getStoredAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default apiClient;
