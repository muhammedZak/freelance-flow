import { createSlice } from '@reduxjs/toolkit';

import {
  addClient,
  editClient,
  fetchClientById,
  fetchClients,
  removeClient,
} from '../thunks/clientsThunks';

const initialState = {
  clients: [],
  selectedClient: null,

  loading: false,
  error: null,
  successMessage: '',
};

function startRequest(state) {
  state.loading = true;
  state.error = null;
  state.successMessage = '';
}

function failRequest(state, errorMessage) {
  state.loading = false;
  state.error = errorMessage || 'Something went wrong.';
}

function upsertClient(clients, incomingClient) {
  const existingClientIndex = clients.findIndex(
    (client) => client.id === incomingClient.id,
  );

  if (existingClientIndex === -1) {
    clients.push(incomingClient);

    return;
  }

  clients[existingClientIndex] = incomingClient;
}

const clientsSlice = createSlice({
  name: 'clients',

  initialState,

  reducers: {
    clearClientMessages: (state) => {
      state.error = null;
      state.successMessage = '';
    },

    clearSelectedClient: (state) => {
      state.selectedClient = null;
    },

    resetClientsState: () => initialState,
  },

  extraReducers: (builder) => {
    builder
      // ---------------------------------
      // Fetch clients
      // ---------------------------------
      .addCase(fetchClients.pending, (state) => {
        startRequest(state);
      })

      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.clients = action.payload;
      })

      .addCase(fetchClients.rejected, (state, action) => {
        failRequest(state, action.payload || 'Unable to load clients.');
      })

      // ---------------------------------
      // Fetch client by ID
      // ---------------------------------
      .addCase(fetchClientById.pending, (state) => {
        startRequest(state);

        state.selectedClient = null;
      })

      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.selectedClient = action.payload;

        upsertClient(state.clients, action.payload);
      })

      .addCase(fetchClientById.rejected, (state, action) => {
        failRequest(state, action.payload || 'Unable to load the client.');

        state.selectedClient = null;
      })

      // ---------------------------------
      // Create client
      // ---------------------------------
      .addCase(addClient.pending, (state) => {
        startRequest(state);
      })

      .addCase(addClient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        /*
         * IMPORTANT:
         *
         * action.payload has:
         *
         * {
         *   client,
         *   accountSetup
         * }
         *
         * Only the core client profile is persisted
         * in Redux state.
         *
         * accountSetup contains the temporary
         * password and must remain one-time
         * response metadata for the calling UI.
         */
        const { client } = action.payload;

        upsertClient(state.clients, client);

        state.selectedClient = client;

        state.successMessage = 'Client created successfully.';
      })

      .addCase(addClient.rejected, (state, action) => {
        failRequest(state, action.payload || 'Unable to create the client.');
      })

      // ---------------------------------
      // Update client
      // ---------------------------------
      .addCase(editClient.pending, (state) => {
        startRequest(state);
      })

      .addCase(editClient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedClient = action.payload;

        upsertClient(state.clients, updatedClient);

        state.selectedClient = updatedClient;

        state.successMessage = 'Client updated successfully.';
      })

      .addCase(editClient.rejected, (state, action) => {
        failRequest(state, action.payload || 'Unable to update the client.');
      })

      // ---------------------------------
      // Delete client
      // ---------------------------------
      .addCase(removeClient.pending, (state) => {
        startRequest(state);
      })

      .addCase(removeClient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const deletedClientId = String(action.payload);

        state.clients = state.clients.filter(
          (client) => client.id !== deletedClientId,
        );

        if (state.selectedClient?.id === deletedClientId) {
          state.selectedClient = null;
        }

        state.successMessage = 'Client deleted successfully.';
      })

      .addCase(removeClient.rejected, (state, action) => {
        failRequest(state, action.payload || 'Unable to delete the client.');
      });
  },
});

export const { clearClientMessages, clearSelectedClient, resetClientsState } =
  clientsSlice.actions;

export default clientsSlice.reducer;
