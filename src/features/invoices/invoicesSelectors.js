const INVOICE_ASYNC_STATUS = Object.freeze({
  IDLE: 'idle',
  LOADING: 'loading',
});

const selectInvoicesState = (state) => state.invoices;

const selectSharedInvoiceLoading = (state) =>
  selectInvoicesState(state).loading;

const selectSharedInvoiceError = (state) => selectInvoicesState(state).error;

function selectLegacyOperationStatus(state) {
  return selectSharedInvoiceLoading(state)
    ? INVOICE_ASYNC_STATUS.LOADING
    : INVOICE_ASYNC_STATUS.IDLE;
}

export const selectAllInvoices = (state) => selectInvoicesState(state).invoices;

export const selectSelectedInvoice = (state) =>
  selectInvoicesState(state).selectedInvoice;

export const selectInvoicesSuccessMessage = (state) =>
  selectInvoicesState(state).successMessage;

export const selectInvoicesListStatus = selectLegacyOperationStatus;

export const selectInvoicesListError = selectSharedInvoiceError;

export const selectInvoiceDetailsStatus = selectLegacyOperationStatus;

export const selectInvoiceDetailsError = selectSharedInvoiceError;

export const selectInvoiceCreateStatus = selectLegacyOperationStatus;

export const selectInvoiceCreateError = selectSharedInvoiceError;

export const selectInvoiceUpdateStatus = selectLegacyOperationStatus;

export const selectInvoiceUpdateError = selectSharedInvoiceError;

export const selectInvoiceDeleteStatus = selectLegacyOperationStatus;

export const selectInvoiceDeleteError = selectSharedInvoiceError;

export const selectIsInvoicesListLoading = (state) =>
  selectInvoicesListStatus(state) === INVOICE_ASYNC_STATUS.LOADING;

export const selectIsInvoiceDetailsLoading = (state) =>
  selectInvoiceDetailsStatus(state) === INVOICE_ASYNC_STATUS.LOADING;

export const selectIsInvoiceCreating = (state) =>
  selectInvoiceCreateStatus(state) === INVOICE_ASYNC_STATUS.LOADING;

export const selectIsInvoiceUpdating = (state) =>
  selectInvoiceUpdateStatus(state) === INVOICE_ASYNC_STATUS.LOADING;

export const selectIsInvoiceDeleting = (state) =>
  selectInvoiceDeleteStatus(state) === INVOICE_ASYNC_STATUS.LOADING;
