import API_URL from '../../services/api';

async function getTasks() {
  const res = await fetch(`${API_URL}/tasks`);

  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return await res.json();
}

const tasksService = {
  getTasks,
};

export default tasksService;
