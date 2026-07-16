import API_URL from '../../services/api';
import activitiesService from '../activities/activitiesService';

async function getClients() {
  const response = await fetch(`${API_URL}/clients`);

  if (!response.ok) {
    throw new Error('Failed to fetch clients');
  }

  return await response.json();
}

async function getClientById(id) {
  const response = await fetch(`${API_URL}/clients/${id}`);

  if (!response.ok) {
    throw new Error('Client not found');
  }

  return await response.json();
}

async function createClient(clientData) {
  const newClient = {
    ...clientData,
    createdAt: new Date().toISOString().split('T')[0],
  };

  const response = await fetch(`${API_URL}/clients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newClient),
  });

  if (!response.ok) {
    throw new Error('Failed to create client');
  }

  const savedClient = await response.json();

  await activitiesService.addActivity({
    message: `New client added: ${savedClient.name}`,
    type: 'client',
    createdAt: new Date().toISOString().split('T')[0],
  });

  return savedClient;
}

async function updateClient(id, clientData) {
  const response = await fetch(`${API_URL}/clients/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clientData),
  });

  if (!response.ok) {
    throw new Error('Failed to update client');
  }

  const updatedClient = await response.json();

  await activitiesService.addActivity({
    message: `Client updated: ${updatedClient.name}`,
    type: 'client',
    createdAt: new Date().toISOString().split('T')[0],
  });

  return updatedClient;
}

async function deleteClient(id) {
  const client = await getClientById(id);

  const response = await fetch(`${API_URL}/clients/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete client');
  }

  await activitiesService.addActivity({
    message: `Client deleted: ${client.name}`,
    type: 'client',
    createdAt: new Date().toISOString().split('T')[0],
  });

  return Number(id);
}

const clientsService = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};

export default clientsService;
