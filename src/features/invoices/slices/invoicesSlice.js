import { createSlice } from '@reduxjs/toolkit';

import {
  addInvoice,
  editInvoice,
  fetchInvoiceById,
  fetchInvoices,
  removeInvoice,
} from '../thunks/invoicesThunks';

const ASYNC_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
});

function createOperationState() {
  return {
    status: ASYNC_STATUS.IDLE,
    error: null,
  };
}

const initialState = {
  items: [],
  selectedInvoice: null,

  list: createOperationState(),
  details: createOperationState(),
  create: createOperationState(),
  update: createOperationState(),
  delete: createOperationState(),

  successMessage: '',
};

function startOperation(operation) {
  operation.status = ASYNC_STATUS.LOADING;
  operation.error = null;
}

function completeOperation(operation) {
  operation.status = ASYNC_STATUS.SUCCEEDED;
  operation.error = null;
}

function failOperation(operation, error) {
  operation.status = ASYNC_STATUS.FAILED;
  operation.error = error;
}

function resetOperationError(operation) {
  operation.error = null;

  if (operation.status === ASYNC_STATUS.FAILED) {
    operation.status = ASYNC_STATUS.IDLE;
  }
}

function resetAllOperationErrors(state) {
  resetOperationError(state.list);
  resetOperationError(state.details);
  resetOperationError(state.create);
  resetOperationError(state.update);
  resetOperationError(state.delete);
}

const invoicesSlice = createSlice({
  name: 'invoices',

  initialState,

  reducers: {
    clearInvoiceMessages: (state) => {
      resetAllOperationErrors(state);
      state.successMessage = '';
    },

    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
      state.details = createOperationState();
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        startOperation(state.list);
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        completeOperation(state.list);
        state.items = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        failOperation(state.list, action.payload || 'Unable to load invoices.');
      })

      .addCase(fetchInvoiceById.pending, (state) => {
        startOperation(state.details);
        state.selectedInvoice = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        completeOperation(state.details);
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        failOperation(
          state.details,
          action.payload || 'Unable to load the invoice.',
        );

        state.selectedInvoice = null;
      })

      .addCase(addInvoice.pending, (state) => {
        startOperation(state.create);
        state.successMessage = '';
      })
      .addCase(addInvoice.fulfilled, (state, action) => {
        completeOperation(state.create);

        state.items.push(action.payload);

        state.successMessage = 'Invoice created successfully';
      })
      .addCase(addInvoice.rejected, (state, action) => {
        failOperation(
          state.create,
          action.payload || 'Unable to create the invoice.',
        );
      })

      .addCase(editInvoice.pending, (state) => {
        startOperation(state.update);
        state.successMessage = '';
      })
      .addCase(editInvoice.fulfilled, (state, action) => {
        completeOperation(state.update);

        state.items = state.items.map((invoice) =>
          String(invoice.id) === String(action.payload.id)
            ? action.payload
            : invoice,
        );

        state.selectedInvoice = action.payload;

        state.successMessage = 'Invoice updated successfully';
      })
      .addCase(editInvoice.rejected, (state, action) => {
        failOperation(
          state.update,
          action.payload || 'Unable to update the invoice.',
        );
      })

      .addCase(removeInvoice.pending, (state) => {
        startOperation(state.delete);
        state.successMessage = '';
      })
      .addCase(removeInvoice.fulfilled, (state, action) => {
        completeOperation(state.delete);

        const deletedInvoiceId = String(action.payload);

        state.items = state.items.filter(
          (invoice) => String(invoice.id) !== deletedInvoiceId,
        );

        if (
          state.selectedInvoice &&
          String(state.selectedInvoice.id) === deletedInvoiceId
        ) {
          state.selectedInvoice = null;
        }

        state.successMessage = 'Invoice deleted successfully';
      })
      .addCase(removeInvoice.rejected, (state, action) => {
        failOperation(
          state.delete,
          action.payload || 'Unable to delete the invoice.',
        );
      });
  },
});

export const { clearInvoiceMessages, clearSelectedInvoice } =
  invoicesSlice.actions;

export default invoicesSlice.reducer;
