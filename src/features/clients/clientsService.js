import API_URL from '../../services/api';

async function getClients() {
  const res = await fetch(`${API_URL}/clients`);

  if (!res.ok) {
    throw new Error('Failed to fetch clients.');
  }

  return await res.json();
}

const clientsService = {
  getClients,
};

export default clientsService;
