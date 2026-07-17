import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import paymentService from './paymentsService';

function findInvoiceById(invoices, invoiceId) {
  return invoices.find((invoice) => String(invoice.id) === String(invoiceId));
}

function findPaymentById(payments, paymentId) {
  return payments.find((payment) => String(payment.id) === String(paymentId));
}

function hasCompletedPayment(payments, invoiceId, ignoredPaymentId = null) {
  return payments.some((payment) => {
    const belongsToInvoice = String(payment.invoiceId) === String(invoiceId);

    const isCompleted = payment.status === 'completed';

    const isDifferentPayment =
      ignoredPaymentId === null ||
      String(payment.id) !== String(ignoredPaymentId);

    return belongsToInvoice && isCompleted && isDifferentPayment;
  });
}

function amountsAreEqual(firstAmount, secondAmount) {
  return Number(firstAmount).toFixed(2) === Number(secondAmount).toFixed(2);
}

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      return await paymentService.getPayments();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const addPayment = createAsyncThunk(
  'payments/addPayment',
  async (paymentData, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const invoices = state.invoices.invoices;
      const payments = state.payments.payments;

      const invoice = findInvoiceById(invoices, paymentData.invoiceId);

      if (!invoice) {
        return rejectWithValue('Selected invoice was not found.');
      }

      const amount = Number(paymentData.amount);
      const invoiceTotal = Number(invoice.total);

      if (amount <= 0) {
        return rejectWithValue('Payment amount must be greater than zero.');
      }

      if (amount > invoiceTotal) {
        return rejectWithValue(
          'Payment amount cannot exceed the invoice total.',
        );
      }

      if (
        paymentData.status === 'completed' &&
        !amountsAreEqual(amount, invoiceTotal)
      ) {
        return rejectWithValue(
          'A completed payment must equal the full invoice total.',
        );
      }

      const completedPaymentExists = hasCompletedPayment(
        payments,
        paymentData.invoiceId,
      );

      if (
        paymentData.status === 'completed' &&
        (invoice.status === 'paid' || completedPaymentExists)
      ) {
        return rejectWithValue('This invoice already has a completed payment.');
      }

      const newPaymentData = {
        invoiceId: String(paymentData.invoiceId),
        amount,
        method: paymentData.method,
        paymentDate: paymentData.paymentDate,
        status: paymentData.status,
        createdAt: new Date().toISOString(),
      };

      const newPayment = await paymentService.createPayment(newPaymentData);

      if (newPayment.status === 'completed') {
        await paymentService.updateRelatedInvoiceStatus(
          String(newPayment.invoiceId),
          'paid',
        );
      }

      await paymentService.createPaymentActivity(
        `Payment added for invoice ${invoice.invoiceNumber}.`,
      );

      return newPayment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const changePaymentStatus = createAsyncThunk(
  'payments/changePaymentStatus',
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const payments = state.payments.payments;
      const invoices = state.invoices.invoices;

      const payment = findPaymentById(payments, id);

      if (!payment) {
        return rejectWithValue('Payment was not found.');
      }

      const invoice = findInvoiceById(invoices, payment.invoiceId);

      if (!invoice) {
        return rejectWithValue(
          'The invoice connected to this payment was not found.',
        );
      }

      if (status === 'completed') {
        const completedPaymentExists = hasCompletedPayment(
          payments,
          payment.invoiceId,
          payment.id,
        );

        if (completedPaymentExists) {
          return rejectWithValue(
            'This invoice already has another completed payment.',
          );
        }

        if (!amountsAreEqual(payment.amount, invoice.total)) {
          return rejectWithValue(
            'The payment amount must equal the invoice total before it can be completed.',
          );
        }
      }

      const previousStatus = payment.status;

      const updatedPayment = await paymentService.updatePayment(String(id), {
        status,
      });

      if (status === 'completed') {
        await paymentService.updateRelatedInvoiceStatus(
          String(payment.invoiceId),
          'paid',
        );
      }

      if (previousStatus === 'completed' && status !== 'completed') {
        await paymentService.updateRelatedInvoiceStatus(
          String(payment.invoiceId),
          'unpaid',
        );
      }

      await paymentService.createPaymentActivity(
        `Payment for invoice ${invoice.invoiceNumber} changed to ${status}.`,
      );

      return updatedPayment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

export const removePayment = createAsyncThunk(
  'payments/removePayment',
  async (id, { getState, rejectWithValue }) => {
    try {
      const state = getState();

      const payments = state.payments.payments;
      const invoices = state.invoices.invoices;

      const payment = findPaymentById(payments, id);

      if (!payment) {
        return rejectWithValue('Payment was not found.');
      }

      const invoice = findInvoiceById(invoices, payment.invoiceId);

      await paymentService.deletePayment(String(id));

      if (payment.status === 'completed' && invoice) {
        await paymentService.updateRelatedInvoiceStatus(
          String(payment.invoiceId),
          'unpaid',
        );
      }

      const invoiceNumber = invoice?.invoiceNumber || 'Unknown Invoice';

      await paymentService.createPaymentActivity(
        `Payment deleted for invoice ${invoiceNumber}.`,
      );

      return String(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const initialState = {
  payments: [],
  loading: false,
  error: null,
  successMessage: '',
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearPaymentMessages: (state) => {
      state.error = null;
      state.successMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch payments.';
      })

      .addCase(addPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload);
        state.successMessage = 'Payment added successfully.';
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add payment.';
      })

      .addCase(changePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(changePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;

        const paymentIndex = state.payments.findIndex(
          (payment) => String(payment.id) === String(action.payload.id),
        );

        if (paymentIndex !== -1) {
          state.payments[paymentIndex] = action.payload;
        }

        state.successMessage = 'Payment status updated successfully.';
      })
      .addCase(changePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update payment status.';
      })

      .addCase(removePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = '';
      })
      .addCase(removePayment.fulfilled, (state, action) => {
        state.loading = false;

        state.payments = state.payments.filter(
          (payment) => String(payment.id) !== String(action.payload),
        );

        state.successMessage = 'Payment deleted successfully.';
      })
      .addCase(removePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete payment.';
      });
  },
});

export const { clearPaymentMessages } = paymentsSlice.actions;

export default paymentsSlice.reducer;
