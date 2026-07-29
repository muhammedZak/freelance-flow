import API_URL from '../../services/api';
import apiClient from '../../api/apiClient';

const USERS_ENDPOINT = '/users';

function removePassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

async function login(userData) {
  const response = await apiClient.get(
    // `${USERS_ENDPOINT}?email=${userData.email}`,
    USERS_ENDPOINT,
    {
      params: { email: userData.email, password: userData.password },
    },
  );

  // console.log(response.data);
  // const users = response.data;

  // const foundUser = users.find((user) => {
  //   return user.email === userData.email && user.password === userData.password;
  // });

  if (response.data.length === 0) {
    throw new Error('Invalid email or password');
  } else {
    console.log('Login successful! User data:', response.data[0]);
  }

  const safeUser = removePassword(response.data[0]);

  localStorage.setItem('freelanceflow_user', JSON.stringify(safeUser));

  return safeUser;
}

async function register(userData) {
  const checkResponse = await fetch(`${API_URL}/users?email=${userData.email}`);
  const existingUsers = await checkResponse.json();

  if (existingUsers.length > 0) {
    throw new Error('Email already exists');
  }

  const newUser = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    assignedProjectIds: [],
  };

  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}

function logout() {
  localStorage.removeItem('freelanceflow_user');
}

const authService = {
  login,
  register,
  logout,
};

export default authService;
