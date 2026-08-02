import { createAsyncThunk } from '@reduxjs/toolkit';

import clientsService from '../services/clientsService';

function normalizeText(value) {
  return String(value ?? '').trim();
}

function normalizeEmail(value) {
  return normalizeText(value).toLowerCase();
}

function normalizeId(value) {
  const id = normalizeText(value);

  return id || null;
}

function getErrorMessage(error, fallbackMessage) {
  const responseMessage = error?.response?.data?.message;

  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage;
  }

  const responseError = error?.response?.data?.error;

  if (typeof responseError === 'string' && responseError.trim()) {
    return responseError;
  }

  if (typeof error?.response?.data === 'string' && error.response.data.trim()) {
    return error.response.data;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return fallbackMessage;
}

function toClientProfile(client) {
  if (!client || typeof client !== 'object') {
    throw new Error('The server returned an invalid client profile.');
  }

  const id = normalizeId(client.id);
  const userId = normalizeId(client.userId);
  const freelancerId = normalizeId(client.freelancerId);

  if (!id) {
    throw new Error('The client profile is missing its client ID.');
  }

  if (!userId) {
    throw new Error(`Client ${id} is missing its user reference.`);
  }

  if (!freelancerId) {
    throw new Error(
      `Client ${id} is missing its freelancer ownership reference.`,
    );
  }

  return {
    id,
    userId,
    freelancerId,
    companyName: normalizeText(client.companyName),
    phone: normalizeText(client.phone),
    address: normalizeText(client.address),
  };
}

function toClientProfileList(clients) {
  if (!Array.isArray(clients)) {
    throw new Error('The server returned an invalid clients collection.');
  }

  return clients.map(toClientProfile);
}

function toAccountSetupMetadata(accountSetup) {
  if (!accountSetup || typeof accountSetup !== 'object') {
    return null;
  }

  const temporaryPassword = String(accountSetup.temporaryPassword ?? '');

  if (!temporaryPassword) {
    return null;
  }

  return {
    userId: normalizeId(accountSetup.userId),
    email: normalizeEmail(accountSetup.email),
    temporaryPassword,
  };
}

export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (filters = {}, thunkAPI) => {
    try {
      const clients = await clientsService.getClients(filters);

      return toClientProfileList(clients);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to load clients.'),
      );
    }
  },
);

export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id, thunkAPI) => {
    try {
      const client = await clientsService.getClientById(id);

      return toClientProfile(client);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to load the client.'),
      );
    }
  },
);

export const addClient = createAsyncThunk(
  'clients/addClient',
  async ({ clientData, activeFreelancerId }, thunkAPI) => {
    try {
      const freelancerId = normalizeId(activeFreelancerId);

      if (!freelancerId) {
        throw new Error(
          'An active freelancer ID is required to create a client.',
        );
      }

      const result = await clientsService.createClient(
        clientData,
        freelancerId,
      );

      const client = toClientProfile(result);

      const accountSetup = toAccountSetupMetadata(result?.accountSetup);

      return {
        client,
        accountSetup,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to create the client.'),
      );
    }
  },
);

export const editClient = createAsyncThunk(
  'clients/editClient',
  async ({ id, clientData }, thunkAPI) => {
    try {
      const client = await clientsService.updateClient(id, clientData);

      return toClientProfile(client);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to update the client.'),
      );
    }
  },
);

export const removeClient = createAsyncThunk(
  'clients/removeClient',
  async (id, thunkAPI) => {
    try {
      return await clientsService.deleteClient(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to delete the client.'),
      );
    }
  },
);
