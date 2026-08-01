import apiClient from '@/api/apiClient';

const AUTH_SESSION_STORAGE_KEY = 'freelanceflow_auth_session';
const LEGACY_USER_STORAGE_KEY = 'freelanceflow_user';

function sanitizeUser(user) {
  if (!user || typeof user !== 'object') {
    return null;
  }

  const safeUser = { ...user };
  delete safeUser.password;

  return safeUser;
}

function createEmptySession() {
  return {
    user: null,
    accessToken: null,
  };
}

function createSession(user, accessToken) {
  return {
    user: sanitizeUser(user),
    accessToken,
  };
}

function readStoredSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  const storedValue = window.localStorage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
    return null;
  }
}

function isValidStoredSession(session) {
  return Boolean(
    session &&
    typeof session === 'object' &&
    session.user &&
    typeof session.user === 'object' &&
    typeof session.accessToken === 'string' &&
    session.accessToken.trim(),
  );
}

function persistSession(session) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    AUTH_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  );

  window.localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
}

function clearStoredSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
}

async function checkAuth() {
  const storedSession = readStoredSession();

  if (!isValidStoredSession(storedSession)) {
    clearStoredSession();

    return createEmptySession();
  }

  return createSession(storedSession.user, storedSession.accessToken.trim());
}

async function login(credentials) {
  const payload = {
    email: String(credentials.email ?? '')
      .trim()
      .toLowerCase(),
    password: String(credentials.password ?? ''),
  };

  const response = await apiClient.post('/login', payload);

  const { accessToken, user } = response.data ?? {};

  if (
    typeof accessToken !== 'string' ||
    !accessToken.trim() ||
    !user ||
    typeof user !== 'object'
  ) {
    throw new Error('The authentication server returned an invalid session.');
  }

  const session = createSession(user, accessToken.trim());

  persistSession(session);

  return session;
}

async function register(userData) {
  const payload = {
    name: String(userData.name ?? '').trim(),
    email: String(userData.email ?? '')
      .trim()
      .toLowerCase(),
    password: String(userData.password ?? ''),
    role: String(userData.role ?? 'freelancer'),
    assignedProjectIds: [],
  };

  const response = await apiClient.post('/register', payload);

  const user = sanitizeUser(response.data?.user);

  if (!user) {
    throw new Error('The authentication server returned an invalid user.');
  }

  return user;
}

async function logout() {
  clearStoredSession();

  return true;
}

const authService = {
  checkAuth,
  login,
  register,
  logout,
};

export default authService;
