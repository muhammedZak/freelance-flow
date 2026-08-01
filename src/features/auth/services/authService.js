import apiClient from '@/api/apiClient';

const USERS_ENDPOINT = '/users';
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

function createSession(user, accessToken = null) {
  return {
    user: sanitizeUser(user),
    accessToken: accessToken || null,
  };
}

function readJsonStorageValue(key) {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return null;
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function isStoredSession(value) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    value.user &&
    typeof value.user === 'object',
  );
}

function persistSession(session) {
  localStorage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(session));
  localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
}

async function checkAuth() {
  const storedSession = readJsonStorageValue(AUTH_SESSION_STORAGE_KEY);

  if (isStoredSession(storedSession)) {
    return createSession(storedSession.user, storedSession.accessToken);
  }

  const legacyUser = readJsonStorageValue(LEGACY_USER_STORAGE_KEY);

  if (legacyUser && typeof legacyUser === 'object') {
    const migratedSession = createSession(legacyUser);
    persistSession(migratedSession);
    return migratedSession;
  }

  return createSession(null);
}

async function login(credentials) {
  const email = String(credentials.email ?? '')
    .trim()
    .toLowerCase();
  const password = String(credentials.password ?? '');

  const response = await apiClient.get(USERS_ENDPOINT, {
    params: { email },
  });

  const user = response.data.find(
    (candidate) => candidate.email?.toLowerCase() === email,
  );

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password');
  }

  const session = createSession(user);
  persistSession(session);

  return session;
}

async function register(userData) {
  const email = String(userData.email ?? '')
    .trim()
    .toLowerCase();

  const existingUsersResponse = await apiClient.get(USERS_ENDPOINT, {
    params: { email },
  });

  const emailAlreadyExists = existingUsersResponse.data.some(
    (user) => user.email?.toLowerCase() === email,
  );

  if (emailAlreadyExists) {
    throw new Error('Email already exists');
  }

  const newUser = {
    name: String(userData.name ?? '').trim(),
    email,
    password: String(userData.password ?? ''),
    role: String(userData.role ?? 'freelancer'),
    assignedProjectIds: [],
  };

  const response = await apiClient.post(USERS_ENDPOINT, newUser);

  return sanitizeUser(response.data);
}

async function logout() {
  localStorage.removeItem(AUTH_SESSION_STORAGE_KEY);
  localStorage.removeItem(LEGACY_USER_STORAGE_KEY);
  return true;
}

const authService = {
  checkAuth,
  login,
  register,
  logout,
};

export default authService;
