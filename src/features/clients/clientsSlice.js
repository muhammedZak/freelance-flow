import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import clientsService from './clientsService';

const initialState = {
  clients: [],
  loading: false,
  error: null,
};

export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async (_, thunkApi) => {
    try {
      return await clientsService.getClients();
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
    }
  },
);

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export default clientsSlice.reducer;
