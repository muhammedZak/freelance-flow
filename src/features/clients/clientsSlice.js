import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clientsService from './clientsService';

const initialState = {
  clients: [],
  selectedClient: null,
  loading: false,
  error: null,
  successMessage: '',
};

export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, thunkAPI) => {
    try {
      return await clientsService.getClients();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchClientById = createAsyncThunk(
  'clients/fetchClientById',
  async (id, thunkAPI) => {
    try {
      return await clientsService.getClientById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addClient = createAsyncThunk(
  'clients/addClient',
  async (clientData, thunkAPI) => {
    try {
      return await clientsService.createClient(clientData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const editClient = createAsyncThunk(
  'clients/editClient',
  async ({ id, clientData }, thunkAPI) => {
    try {
      return await clientsService.updateClient(id, clientData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const removeClient = createAsyncThunk(
  'clients/removeClient',
  async (id, thunkAPI) => {
    try {
      return await clientsService.deleteClient(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

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
  },
  extraReducers: (builder) => {
    builder
      // Fetch all clients
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.clients = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch one client
      .addCase(fetchClientById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedClient = null;
      })
      .addCase(fetchClientById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedClient = action.payload;
      })
      .addCase(fetchClientById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedClient = null;
      })

      // Add client
      .addCase(addClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.loading = false;
        state.clients.push(action.payload);
        state.successMessage = 'Client added successfully';
      })
      .addCase(addClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Edit client
      .addCase(editClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(editClient.fulfilled, (state, action) => {
        state.loading = false;

        state.clients = state.clients.map((client) =>
          client.id === action.payload.id ? action.payload : client,
        );

        state.selectedClient = action.payload;
        state.successMessage = 'Client updated successfully';
      })
      .addCase(editClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete client
      .addCase(removeClient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(removeClient.fulfilled, (state, action) => {
        state.loading = false;

        state.clients = state.clients.filter(
          (client) => client.id !== action.payload,
        );

        state.successMessage = 'Client deleted successfully';
      })
      .addCase(removeClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearClientMessages, clearSelectedClient } =
  clientsSlice.actions;

export default clientsSlice.reducer;
