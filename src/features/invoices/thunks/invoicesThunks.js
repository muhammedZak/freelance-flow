import { createAsyncThunk } from '@reduxjs/toolkit';

import invoicesService from '../invoicesService';

function getErrorMessage(error, fallbackMessage) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === 'string' && error.trim()) {
    return error;
  }

  return fallbackMessage;
}

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchInvoices',
  async (_, thunkAPI) => {
    try {
      return await invoicesService.getInvoices();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to load invoices.'),
      );
    }
  },
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchInvoiceById',
  async (id, thunkAPI) => {
    try {
      return await invoicesService.getInvoiceById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to load the invoice.'),
      );
    }
  },
);

export const addInvoice = createAsyncThunk(
  'invoices/addInvoice',
  async (invoiceData, thunkAPI) => {
    try {
      return await invoicesService.createInvoice(invoiceData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to create the invoice.'),
      );
    }
  },
);

export const editInvoice = createAsyncThunk(
  'invoices/editInvoice',
  async ({ id, invoiceData }, thunkAPI) => {
    try {
      return await invoicesService.updateInvoice(id, invoiceData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to update the invoice.'),
      );
    }
  },
);

export const removeInvoice = createAsyncThunk(
  'invoices/removeInvoice',
  async (id, thunkAPI) => {
    try {
      return await invoicesService.deleteInvoice(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, 'Unable to delete the invoice.'),
      );
    }
  },
);
