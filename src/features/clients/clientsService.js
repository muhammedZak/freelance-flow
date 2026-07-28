import API_URL from '../../services/api';
import activitiesService from '../activities/activitiesService';
import apiClient from '../../api/apiClient';

const CLIENTS_ENDPOINT = '/clients';

async function getClients() {
  const { data } = await apiClient.get(CLIENTS_ENDPOINT);

  return data;
}

async function getClientById(id) {
  const { data } = await apiClient.get(`${CLIENTS_ENDPOINT}/${id}`);

  return data;
}

async function createClient(clientData) {
  const newClient = {
    ...clientData,
    createdAt: new Date().toISOString().split('T')[0],
  };

  const { data } = await apiClient.post(CLIENTS_ENDPOINT, newClient);

  const savedClient = await data;

  await activitiesService.addActivity({
    message: `New client added: ${savedClient.name}`,
    type: 'client',
    createdAt: new Date().toISOString().split('T')[0],
  });

  return savedClient;
}

async function updateClient(id, clientData) {
  const response = await apiClient.patch(
    `${CLIENTS_ENDPOINT}/${id}`,
    clientData,
  );

  const updatedClient = response.data;

  await activitiesService.addActivity({
    message: `Client updated: ${updatedClient.name}`,
    type: 'client',
    createdAt: new Date().toISOString().split('T')[0],
  });

  return updatedClient;
}

async function deleteClient(id) {
  const client = await getClientById(id);

  const response = await apiClient.delete(`${CLIENTS_ENDPOINT}/${id}`);

  await activitiesService.addActivity({
    message: `Client deleted: ${client.name}`,
    type: 'client',
    createdAt: new Date().toISOString().split('T')[0],
  });

  return id;
}

const clientsService = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};

export default clientsService;
