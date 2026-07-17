import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import invoicesService from './invoicesService';

const initialState = {
  invoices: [],
  selectedInvoice: null,
  loading: false,
  error: null,
  successMessage: '',
};

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, thunkAPI) => {
    try {
      return await invoicesService.getInvoices();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id, thunkAPI) => {
    try {
      return await invoicesService.getInvoiceById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const addInvoice = createAsyncThunk(
  'invoices/addInvoice',
  async (invoiceData, thunkAPI) => {
    try {
      return await invoicesService.createInvoice(invoiceData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const editInvoice = createAsyncThunk(
  'invoices/editInvoice',
  async ({ id, invoiceData }, thunkAPI) => {
    try {
      return await invoicesService.updateInvoice(id, invoiceData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

export const removeInvoice = createAsyncThunk(
  'invoices/removeInvoice',
  async (id, thunkAPI) => {
    try {
      return await invoicesService.deleteInvoice(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const invoicesSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearInvoiceMessages: (state) => {
      state.error = null;
      state.successMessage = '';
    },
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedInvoice = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedInvoice = null;
      })

      .addCase(addInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(addInvoice.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices.push(action.payload);
        state.successMessage = 'Invoice created successfully';
      })
      .addCase(addInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(editInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(editInvoice.fulfilled, (state, action) => {
        state.loading = false;

        state.invoices = state.invoices.map((invoice) =>
          String(invoice.id) === String(action.payload.id)
            ? action.payload
            : invoice,
        );

        state.selectedInvoice = action.payload;
        state.successMessage = 'Invoice updated successfully';
      })
      .addCase(editInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeInvoice.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(removeInvoice.fulfilled, (state, action) => {
        state.loading = false;

        state.invoices = state.invoices.filter(
          (invoice) => String(invoice.id) !== String(action.payload),
        );

        if (
          state.selectedInvoice &&
          String(state.selectedInvoice.id) === String(action.payload)
        ) {
          state.selectedInvoice = null;
        }

        state.successMessage = 'Invoice deleted successfully';
      })
      .addCase(removeInvoice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInvoiceMessages, clearSelectedInvoice } =
  invoicesSlice.actions;

export default invoicesSlice.reducer;
