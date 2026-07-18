import API_URL from '../../services/api';

function removePassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

async function login(userData) {
  const response = await fetch(`${API_URL}/users?email=${userData.email}`);
  const users = await response.json();

  const foundUser = users.find((user) => {
    return user.email === userData.email && user.password === userData.password;
  });

  if (!foundUser) {
    throw new Error('Invalid email or password');
  }

  const safeUser = removePassword(foundUser);

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
